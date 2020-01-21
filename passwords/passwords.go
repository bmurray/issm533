package passwords

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	// "time"
)

type Passwords struct {
	rdr   io.ReadWriter
	mutex sync.Mutex
	users map[string][]*Password
}

type passwordreq struct {
	Username string `json:"user"`
	Password string `json:"Password"`
}

var encodingList []string = []string{"md5", "sha1", "sha512", "md5-salted", "sha512-salted", "pbkdf2-md5", "pbkdf2-sha512", "bcrypt", "scrypt"}

func NewPasswords(file io.ReadWriteSeeker) *Passwords {
	// file.Write([]byte("GO SUCK A DICK\n"))

	scanner := bufio.NewScanner(file)
	f := &Passwords{
		rdr:   file,
		users: make(map[string][]*Password),
	}
	for scanner.Scan() {
		line := scanner.Text()
		// log.Println("Got line", line)
		l := strings.Split(line, ",")
		if len(l) >= 2 {
			f.insertPassword(l[0], l[1])
		}
	}
	if err := scanner.Err(); err != nil {
		log.Println("Scanner got: %s", err)
	}
	// log.Println("New passwords done")

	return f
}

func (p *Passwords) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	respondCors(w, r)
	switch r.Method {
	case "OPTIONS":
		return
		break
	case "POST":
		p.ServePOST(w, r)
	case "GET":
		p.ServeGET(w, r)
	}
}

func (p *Passwords) ServePOST(w http.ResponseWriter, r *http.Request) {
	x := passwordreq{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&x)
	if err != nil {
		log.Printf("Cannot Decode Data: %s", err)
		return
	}
	log.Printf("Decoded username: %s and password: %s", x.Username, x.Password)
	if len(x.Username) == 0 || len(x.Password) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	p.AddPassword(x.Username, x.Password)

}
func (p *Passwords) ServeGET(w http.ResponseWriter, r *http.Request) {
	p.mutex.Lock()
	defer p.mutex.Unlock()
	// printJSON(p.users)

	// printJSON(os.Stdout, r.Header)

	accept := r.Header.Get("Accept")
	u := r.URL.Query().Get("user")

	if accept == "application/json" {
		p.serveAJAXGET(w, u)
		return
	}
	// printJSON(w, p.users)

	q := r.URL.Query().Get("enc")

	if len(u) > 0 {
		user, ok := p.users[u]
		if !ok {
			http.Error(w, "Cannot Find User", http.StatusNotFound)
			return
		}
		printPasswords(w, q, user)
		return
	} else {
		for _, user := range p.users {
			printPasswords(w, q, user)
		}
	}
}
func (p *Passwords) serveAJAXGET(w http.ResponseWriter, uid string) {
	if len(uid) > 0 {
		user, ok := p.users[uid]
		if !ok {
			http.Error(w, "Cannot Find User", http.StatusNotFound)
			return
		}
		var wg sync.WaitGroup
		wg.Add(len(user))
		for _, pass := range user {
			go func(p *Password) {
				wg.Add(len(encodingList))
				for _, enc := range encodingList {
					go func(p *Password, e string) {
						p.Encoding(e)
						wg.Done()
					}(p, enc)
				}
				wg.Done()
			}(pass)
		}
		wg.Wait()

		printJSON(w, user)
		return
	}
	printJSON(w, p.users)
}
func printPasswords(w io.Writer, encoding string, passwords []*Password) {
	for _, password := range passwords {
		x := password.Stats(encoding)
		if len(x.Encoded()) > 0 {
			fmt.Fprintf(w, "%s\n", x.Encoded())
		}
	}
}

func (p *Passwords) AddPassword(user, pass string) {
	p.insertPassword(user, pass)
	p.writePassword(user, pass)
}
func (p *Passwords) insertPassword(user, pass string) {
	p.mutex.Lock()
	defer p.mutex.Unlock()
	_, ok := p.users[user]
	if !ok {
		p.users[user] = []*Password{NewPassword(pass)}
		return
	}
	p.users[user] = append(p.users[user], NewPassword(pass))
}
func (p *Passwords) writePassword(user, pass string) {
	_, err := fmt.Fprintf(p.rdr, "%s,%s\n", user, pass)
	if err != nil {
		log.Printf("Cannot write to file: %s", err)
	}
}

func respondCors(w http.ResponseWriter, r *http.Request) {
	hdrs := w.Header()
	hdrs.Set("Access-Control-Allow-Origin", "*")
	hdrs.Set("Access-Control-Allow-Method", "POST")
	hdrs.Set("Access-Control-Allow-Headers", "Content-Type")
	// Access-Control-Request-Method: POST
	// Access-Control-Request-Headers: X-PINGOTHER, Content-Type
	// w.WriteHeader(http.StatusOK)
}

func printJSON(w io.Writer, v interface{}) {

	data, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		log.Println("Cannot marshal GET", err)
		return
	}
	fmt.Fprintf(w, "%s", string(data))
}
