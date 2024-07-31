package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {

	http.HandleFunc("/", getHello)
	http.HandleFunc("/complex", getComplex)

	err := http.ListenAndServe(":3002", nil)

	if err != nil {
		fmt.Printf("Error starting server: %s", err.Error())
	}
}

func getHello(w http.ResponseWriter, r *http.Request) {
	io.WriteString(w, "Hello, from Golang")

}

func getComplex(w http.ResponseWriter, r *http.Request) {

	sum := 0
	for i := 0; i < 1000000; i++ {
		sum += i
	}

	io.WriteString(w, fmt.Sprintf("%d", sum))
}