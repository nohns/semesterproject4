package main

import (
	"log"
	"net/url"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/websocket"
)

var (
	ip          = "localhost" // server IP
	connections = 1000        // number of websocket connections
)

func main() {
	u := url.URL{Scheme: "ws", Host: ip + ":9090", Path: "/ws"}
	log.Printf("Connecting to %s", u.String())

	var conns []*websocket.Conn
	successfulConns := 0
	failedConns := 0

	// Handling Ctrl+C or other interrupt signals
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-interrupt
		log.Println("Received shutdown signal, closing all connections...")
		for _, conn := range conns {
			conn.Close()
		}
		os.Exit(0)
	}()

	for i := 0; i < connections; i++ {
		c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
		if err != nil {
			//log.Printf("Failed to connect %d: %v", i, err)
			failedConns++
			continue
		}
		conns = append(conns, c)
		successfulConns++
		defer c.Close()
	}

	log.Printf("Finished initializing connections. Successful: %d, Failed: %d", successfulConns, failedConns)

	tts := time.Second
	if connections > 100 {
		tts = time.Millisecond * 5
	}

	ticker := time.NewTicker(time.Second * 10)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			log.Printf("Currently active connections: %d", len(conns))
		case <-time.After(tts):
			for _, conn := range conns {
				if err := conn.WriteControl(websocket.PingMessage, nil, time.Now().Add(time.Second*5)); err != nil {
					conn.Close()
				}
			}
		}
	}
}
