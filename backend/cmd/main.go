package main

import (
	"context"
	"log"

	"github.com/nohns/semesterproject4/app"

)

func main() {
	a, err := app.BootstrapMocked()
	if err != nil {
		log.Fatalf("Failed to boostrap app: %v", err)
	}

	err = a.Run(context.Background())
	if err != nil {
		log.Fatalf("Failed to run app: %v", err)
	}
}
