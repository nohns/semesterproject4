package main

import (
	"log"
	"log/slog"
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
		Level: slog.LevelError,
	}

	handler := slog.NewJSONHandler(os.Stdout, opts)

	logger := slog.New(handler)

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

type broadcaster interface {
	Broadcast([]byte)
}

func spam(broadcaster broadcaster) {
	for {
		time.Sleep(time.Second * 100)
		msg := []byte("hello")
		broadcaster.Broadcast(msg)

	}

}
