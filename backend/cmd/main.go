package main

import (
	"context"
	"encoding/json"
	"log"
	"log/slog"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"time"

	pe "github.com/nohns/semesterproject4"
	"github.com/nohns/semesterproject4/engine"
	"github.com/nohns/semesterproject4/mock"
	"github.com/nohns/semesterproject4/websocket"

	_ "net/http/pprof"
)

func main() {
	opts := &slog.HandlerOptions{
		/* Level: slog.LevelError, */
	}

	// Initialize logger
	handler := slog.NewJSONHandler(os.Stdout, opts)
	logger := slog.New(handler)

	// Initialize domain dependencies
	var hp pe.HistoryProvider = &mock.Data
	var cp pe.CurrPricer = &mock.Data
	var bevrepo pe.BeverageRepo = &mock.Data
	var ps pe.PriceStorer = &mock.Data

	// Websocket manager needs a pointer to whatever owns the entirety of the draw graphs data that must be send on initial connection
	websocketManager, err := websocket.NewManager(&websocket.ManagerOptions{
		Addr:   ":9090",
		Logger: logger,
		InitConnFunc: func(c *websocket.Conn) {
			// Gather price histories
			histories, err := hp.Histories(context.TODO())
			if err != nil {
				logger.Error("Failed to get histories when initiating ws connection", slog.String("error", err.Error()))
				c.Close()
				return
			}
			// Convert to message to be sent to frontend
			b, err := json.Marshal(pe.NewHistoryMsg(histories))
			if err != nil {
				logger.Error("Failed to json marshal histories when initiating ws connection", slog.String("error", err.Error()))
				c.Close()
				return
			}
			c.Send(b)
		},
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

	// Run princing eng and broadcast updates
	eng := engine.New(engine.Config{
		FirstUpdateMode: engine.FirstUpdateModeFollow,
		UpdateInterval:  10 * time.Second,
	})
	bevs, err := bevrepo.FindBeverages(context.TODO())
	if err != nil {
		logger.Error("Failed to get beverages", slog.String("error", err.Error()))
		return
	}
	for _, bev := range bevs {
		price, err := cp.CurrentPrice(context.TODO(), bev.ID)
		if err != nil {
			logger.Error("Failed to get current price", slog.String("error", err.Error()))
			return
		}

		err = eng.TrackItem(bev.ID, engine.ItemParams{
			MaxPrice:      bev.Params.MaxPrice,
			MinPrice:      bev.Params.MinPrice,
			InitialPrice:  price,
			BuyMultiplier: bev.Params.BuyMultiplier,
			HalfTime:      int(bev.Params.HalfTime / time.Second),
		})
		if err != nil {
			logger.Error("Failed to track item", slog.String("error", err.Error()), slog.Any("item", bev), slog.Float64("price", price))
			return
		}
	}

	eng.Start()
	go func() {
		defer eng.Terminate()

		for {
			u, err := eng.ReadUpdate()
			if err != nil {
				logger.Error("Could not read update from pricing engine,", slog.String("error", err.Error()))
				return
			}
			logger.Info("Received price update", slog.Any("update", u))

			err = ps.StorePrice(context.TODO(), pe.Update{
				BevID: u.Id,
				Price: u.Price,
				At:    u.At,
			})
			if err != nil {
				logger.Error("Could not store price update", slog.String("error", err.Error()), slog.Any("update", u))
			}

			msg := pe.NewUpdateMsg(pe.Update{
				BevID: u.Id,
				Price: u.Price,
				At:    u.At,
			})
			b, err := json.Marshal(msg)
			if err != nil {
				logger.Error("Could not marshal price update msg,", slog.String("error", err.Error()), slog.Any("msg", msg))
				return
			}
			websocketManager.Broadcast(b)
		}
	}()

	// Blocking to keep the main process alive
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt /*, syscall.SIGTERM*/)
	<-signals

	websocketManager.Stop()
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

		// Create product 2
		product2 := Product{
			ID:            "2",
			Name:          "Blå vand",
			Description:   "Vand og blåt vand",
			Image:         "/images/vand.jpg",
			OriginalPrice: randomPrice(),
			CurrentPrice:  randomPrice(),
			TimeStamp:     time.Now().Format(time.RFC3339),
		}

		product3 := Product{
			ID:            "3",
			Name:          "Sort vand",
			Description:   "Vand og blåt vand",
			Image:         "/images/vand.jpg",
			OriginalPrice: randomPrice(),
			CurrentPrice:  randomPrice(),
			TimeStamp:     time.Now().Format(time.RFC3339),
		}

		product4 := Product{
			ID:            "4",
			Name:          "Rødt vand",
			Description:   "Vand og blåt vand",
			Image:         "/images/vand.jpg",
			OriginalPrice: randomPrice(),
			CurrentPrice:  randomPrice(),
			TimeStamp:     time.Now().Format(time.RFC3339),
		}

		// Convert product 1 to json slice of bytes
		product1Json, err := json.Marshal(product1)
		if err != nil {
			log.Println("Failed to marshal product 1")
		}

		// Convert product 2 to json slice of bytes
		product2Json, err := json.Marshal(product2)
		if err != nil {
			log.Println("Failed to marshal product 2")
		}

		// Convert product 3 to json slice of bytes
		product3Json, err := json.Marshal(product3)
		if err != nil {
			log.Println("Failed to marshal product 3")
		}

		// Convert product 4 to json slice of bytes
		product4Json, err := json.Marshal(product4)
		if err != nil {
			log.Println("Failed to marshal product 4")
		}

		// Send the data as an array of json
		msg := []byte("[" + string(product1Json) + "," + string(product2Json) + "," + string(product3Json) + "," + string(product4Json) + "]")

		time.Sleep(time.Second * 5)

		broadcaster.Broadcast(msg)

	}
}

// Function which generates a random number between 0 and 100
// 70% of the time the number will be between 15 and 40
// 5% of the time the number will be between 0 and 15
// 25% of the time the number will be between 40 and 100
func randomPrice() float64 {
	segment := rand.Float64()

	if segment < 0.7 {
		return 15 + rand.Float64()*(40-15)
	} else if segment < 0.75 {
		return rand.Float64() * 15
	} else {
		return 40 + rand.Float64()*(100-40)
	}
}
