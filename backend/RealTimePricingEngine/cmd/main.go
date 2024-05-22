package main

import (
	"context"
	"log"

	"github.com/nohns/semesterproject4/app"
)

func main() {
	a, err := app.Bootstrap()
	if err != nil {
		log.Fatalf("Failed to bootstrap app: %v", err)
	}

	err = a.Run(context.Background())
	if err != nil {
		log.Fatalf("Failed to run app: %v", err)
	}
}
