package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/bmurray/issm533/passwords"
	"github.com/markbates/pkger"
)

func main() {
	var listenAddr string
	var localDir string
	var pwdfile string
	var reset bool
	flag.StringVar(&listenAddr, "listen", ":8080", "HTTP Address to listen on")
	flag.StringVar(&localDir, "dir", "", "Serve content from a local directory instead of from binary packed data")
	flag.StringVar(&pwdfile, "passwords", "passwords.db", "Use a different password file")
	flag.BoolVar(&reset, "reset", false, "Reset All Settings and Databases")
	flag.Parse()

	mux := http.NewServeMux()
	if len(localDir) > 0 {
		mux.Handle("/", http.FileServer(http.Dir(localDir)))
		// .Dir("/web/build")))
	} else {
		mux.Handle("/", http.FileServer(pkger.Dir("/web/build")))
	}

	flags := os.O_CREATE | os.O_RDWR
	if reset {
		flags |= os.O_TRUNC
	}
	pwdf, err := os.OpenFile(pwdfile, flags, 0644)
	if err != nil {
		log.Fatalf("Cannot Open Password File: %s", err)
	}

	pwds := passwords.NewPasswords(pwdf)

	mux.Handle("/password", pwds)

	s := &http.Server{
		Addr:           listenAddr,
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	log.Fatal(s.ListenAndServe())
}
