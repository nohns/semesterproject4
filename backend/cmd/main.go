package main

import (
	"log/slog"

	"github.com/nohns/semesterproject4/pricing-engine/engine"
	"github.com/nohns/semesterproject4/websocket"
)

func main() {

	logger := slog.Default()

	engine := engine.New()
	engine.Start()

	websocketManager, err := websocket.NewWebsocketManager(&websocket.ManagerOptions{
		Addr:   ":9090",
		Logger: logger,
		/* Broker: broker, */
	})
	if err != nil {

		logger.Error("Failed to initialize websocket manager,", slog.String("error", err.Error()))
	}

	go func() {
		if err := websocketManager.ListenAndServe(); err != nil {
			logger.Error("Failed to start websocket manager,", slog.String("error", err.Error()))
		}

	}()

}
