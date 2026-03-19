package main

import (
	"fmt"
	"net/http"
)

func main() {

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ws(w, r)
	})

	fmt.Println("Sarge WS Server Running on 8080")
	http.ListenAndServe(":8080", mux)
}
