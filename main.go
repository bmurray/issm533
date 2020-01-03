package main

import (
	"flag"
	"log"
	"net/http"
	"time"

	"github.com/markbates/pkger"
)

func main() {
	var listenAddr string
	var localDir string
	flag.StringVar(&listenAddr, "listen", ":8080", "HTTP Address to listen on")
	flag.StringVar(&localDir, "dir", "", "Serve content from a local directory instead of from binary packed data")
	flag.Parse()

	mux := http.NewServeMux()
	if len(localDir) > 0 {
		mux.Handle("/", http.FileServer(http.Dir(localDir)))
		// .Dir("/web/build")))

	} else {
		mux.Handle("/", http.FileServer(pkger.Dir("/web/build")))

	}
	s := &http.Server{
		Addr:           listenAddr,
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	log.Fatal(s.ListenAndServe())
}
