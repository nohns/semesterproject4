package main

import (
	"encoding/json"
	"log"
	"log/slog"
	"math/rand"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nohns/semesterproject4/pricing-engine/engine"
	"github.com/nohns/semesterproject4/websocket"

	"net/http"
	_ "net/http/pprof"
)

func main() {

	// Increase resources limitations
	var rLimit syscall.Rlimit
	if err := syscall.Getrlimit(syscall.RLIMIT_NOFILE, &rLimit); err != nil {
		panic(err)
	}
	rLimit.Cur = rLimit.Max
	if err := syscall.Setrlimit(syscall.RLIMIT_NOFILE, &rLimit); err != nil {
		panic(err)
	}

	opts := &slog.HandlerOptions{
		/* Level: slog.LevelError, */
	}

	handler := slog.NewJSONHandler(os.Stdout, opts)

	logger := slog.New(handler)

	//Websocket manager needs a pointer to whatever owns the entirety of the draw graphs data that must be send on initial connection
	websocketManager, err := websocket.NewWebsocketManager(&websocket.ManagerOptions{
		Addr:   ":9090",
		Logger: logger,
	})
	if err != nil {

		logger.Error("Failed to initialize websocket manager,", slog.String("error", err.Error()))
	}

	go func() {
		if err := websocketManager.ListenAndServe(); err != nil {
			logger.Error("Failed to start websocket manager,", slog.String("error", err.Error()))
		}
	}()

	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	go spam(websocketManager)

	//Blocking to keep the main process alive
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt, syscall.SIGTERM)
	<-signals

	websocketManager.Stop()

	//Idk what to do with this shit 😡
	engine := engine.New()
	engine.Start()

}

type Product struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Description   string  `json:"description"`
	Image         string  `json:"image"`
	OriginalPrice float64 `json:"originalPrice"`
	CurrentPrice  float64 `json:"currentPrice"`
	TimeStamp     string  `json:"timeStamp"`
}

type broadcaster interface {
	Broadcast([]byte)
}

func spam(broadcaster broadcaster) {
	for {

		product1 := Product{
			ID:            "1",
			Name:          "Øl",
			Description:   "Refreshing beverage",
			Image:         "/images/øl.jpg",
			OriginalPrice: randomPrice(),
			CurrentPrice:  randomPrice(),
			TimeStamp:     time.Now().Format(time.RFC3339),
		}

		//Create product 2
		product2 := Product{
			ID:            "2",
			Name:          "Blå vand",
			Description:   "Vand og blåt vand",
			Image:         "/images/vand.jpg",
			OriginalPrice: randomPrice(),
			CurrentPrice:  randomPrice(),
			TimeStamp:     time.Now().Format(time.RFC3339),
		}

		//Convert product 1 to json slice of bytes
		product1Json, err := json.Marshal(product1)
		if err != nil {
			log.Println("Failed to marshal product 1")
		}

		//Convert product 2 to json slice of bytes
		product2Json, err := json.Marshal(product2)
		if err != nil {
			log.Println("Failed to marshal product 2")
		}

		//Send the data as an array of json
		msg := []byte("[" + string(product1Json) + "," + string(product2Json) + "]")

		time.Sleep(time.Second * 5)

		broadcaster.Broadcast(msg)

	}

}

// function which generates a random number between 0 and 100
func randomPrice() float64 {
	return rand.Float64() * 100
}
