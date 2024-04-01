package main

import (
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nohns/semesterproject4/pricing-engine/engine"
	"github.com/nohns/semesterproject4/websocket"
)

func main() {

	logger := slog.Default()

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

type broadcaster interface {
	Broadcast([]byte)
}

func spam(broadcaster broadcaster) {
	for {
		time.Sleep(time.Second * 1)
		msg := []byte("hello")
		broadcaster.Broadcast(msg)

	}

}
