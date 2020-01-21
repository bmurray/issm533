package passwords

import (
	"crypto/md5"
	"crypto/rand"
	"crypto/sha1"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"hash"
	"log"
	"sync"
	"time"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/crypto/pbkdf2"
	"golang.org/x/crypto/scrypt"
)

type Password struct {
	mutex     sync.Mutex
	plain     string
	encodings map[string]Encoding
}
type Encoding struct {
	encoding string
	encoded  string
	duration time.Duration
}

func NewPassword(pass string) *Password {
	return &Password{
		plain:     pass,
		encodings: make(map[string]Encoding),
	}
}

func (p Password) MarshalJSON() ([]byte, error) {
	encodings := make([]Encoding, 0, len(p.encodings))
	for _, e := range p.encodings {
		encodings = append(encodings, e)
	}
	return json.Marshal(struct {
		Plain     string
		Encodings []Encoding
	}{
		Plain:     p.plain,
		Encodings: encodings,
	})
}

func (p *Password) Encoding(enc string) string {
	e := p.Stats(enc)
	return e.Encoded()
}
func (p *Password) Stats(enc string) Encoding {
	p.mutex.Lock()
	x, ok := p.encodings[enc]
	p.mutex.Unlock()
	if ok {
		return x
	}
	e, err := NewEncoding(enc, p.plain)
	if err != nil {
		log.Println("Cannot encode: ", err)
		return Encoding{}
	}
	p.mutex.Lock()
	p.encodings[enc] = e
	p.mutex.Unlock()
	return e
}

func NewEncoding(enc, plain string) (Encoding, error) {
	x := ""
	t := time.Now()
	switch enc {
	case "md5":
		z := md5.Sum([]byte(plain))
		x = fmt.Sprintf("%x", z)
	case "sha1":
		z := sha1.Sum([]byte(plain))
		x = fmt.Sprintf("%x", z)
	case "sha256":
		z := sha256.Sum256([]byte(plain))
		x = fmt.Sprintf("%x", z)
	case "sha512":
		z := sha512.Sum512([]byte(plain))
		x = fmt.Sprintf("%x", z)
	case "pbkdf2-md5":
		x = makePBKDF2(plain, "md5", 8, 1000, 32, md5.New)
	case "pbkdf2-sha1":
		x = makePBKDF2(plain, "sha1", 8, 1000, 32, sha1.New)
	case "pbkdf2-sha256":
		x = makePBKDF2(plain, "sha256", 8, 1000, 32, sha256.New)
	case "pbkdf2-sha512":
		x = makePBKDF2(plain, "sha512", 8, 1000, 32, sha512.New)
	case "bcrypt":
		z, err := bcrypt.GenerateFromPassword([]byte(plain), 10)
		if err != nil {
			return Encoding{}, err
		}
		x = string(z)
	case "scrypt":
		x = makeSCrypt(plain, 8, 32768, 32)

	default:
		return Encoding{}, fmt.Errorf("Unknown encoding: %s", enc)
	}
	if len(x) < 1 {
		return Encoding{}, fmt.Errorf("Cannot make encoding: %s", enc)
	}
	return Encoding{encoded: x, encoding: enc, duration: time.Now().Sub(t)}, nil
}
func (e Encoding) Encoded() string {
	return e.encoded
}
func (e Encoding) Duration() time.Duration {
	return e.duration
}
func (e Encoding) MarshalJSON() ([]byte, error) {
	return json.Marshal(struct {
		Encoding string
		Encoded  string
		Duration string
	}{
		Encoding: e.encoding,
		Encoded:  e.encoded,
		Duration: e.duration.String(),
	})
}

func makePBKDF2(plain, hashtype string, saltlen, iter, len int, h func() hash.Hash) string {

	salt := make([]byte, saltlen)
	_, err := rand.Read(salt)
	if err != nil {
		fmt.Println("Cannot generate salt", err)
		return ""
	}
	dk := pbkdf2.Key([]byte(plain), salt, iter, len, h)
	salt64 := base64.StdEncoding.EncodeToString(salt)
	hash64 := base64.StdEncoding.EncodeToString(dk)
	return fmt.Sprintf("%s:%d:%s:%s", hashtype, iter, salt64, hash64)
}
func makeSCrypt(plain string, saltlen, cost, keyLen int) string {
	const (
		r = 8
		p = 1
	)
	salt := make([]byte, saltlen)
	_, err := rand.Read(salt)
	if err != nil {
		fmt.Println("Cannot generate salt", err)
		return ""
	}
	dk, err := scrypt.Key([]byte(plain), salt, cost, r, p, keyLen)
	if err != nil {
		return ""
	}
	salt64 := base64.StdEncoding.EncodeToString(salt)
	hash64 := base64.StdEncoding.EncodeToString(dk)
	x := fmt.Sprintf("SCRYPT:%d:%d:%d:%s:%s", cost, r, p, salt64, hash64)
	// fmt.Printf("SCrypt: %s\n", x)
	return x

}
