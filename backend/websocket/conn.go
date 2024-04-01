package websocket

import (
	"log"
	"log/slog"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"go.uber.org/zap"
)

const (
	// wait time for message sends to succeed.
	writeTimeout = 10 * time.Second
	// close connections where we haven't received a ping in `idleTimeout`.
	idleTimeout = 70 * time.Second
	// How often we ping clients.
	pingPeriod = 30 * time.Second

	// Max number of messages queued in send buffer.
	sendBufferSize = 200
	// Max number of messages queued in receive buffer.
	recieveBufferSize = 200
)

type conn struct {
	conn             *websocket.Conn
	sendChannel      chan []byte
	heartbeatChannel chan []byte
	shutdown         chan any
	cleanupOnce      *sync.Once

	logger *slog.Logger

	lastPongAt time.Time
}

type connOptions struct {
	conn   *websocket.Conn
	logger *zap.Logger
}

func newConnection(o *connOptions) *conn {
	return &conn{
		conn:             o.conn,
		sendChannel:      make(chan []byte, sendBufferSize),
		heartbeatChannel: make(chan []byte, recieveBufferSize),
		shutdown:         make(chan interface{}),
		cleanupOnce:      &sync.Once{},
		logger:           o.logger,
	}
}

func (c *conn) writePump() {
	c.logger.Info("Write pump started")

	ticker := time.NewTicker(pingPeriod)
	defer func() {
		c.logger.Info("Write pump stopped")
		ticker.Stop()
		c.cleanup()
	}()

	for {
		select {
		case <-c.shutdown:
			return

			//Send inputs from the send channel to the websocket connection
		case msg, ok := <-c.sendChannel:
			// If the channel is closed, we should stop the goroutine.
			if !ok {
				c.logger.Info("Send channel closed")
				return
			}

			if err := c.conn.SetWriteDeadline(time.Now().Add(writeTimeout)); err != nil {
				c.logger.Error("Failed to set write deadline", zap.Error(err))
				return
			}

			if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {

				c.logger.Error("Failed to write message", zap.Error(err))
				return
			}
			c.logger.Info("Message sent")

			//Send ping messages to the websocket connection
		case _, ok := <-c.heartbeatChannel:
			if !ok {
				return
			}
			if err := c.conn.SetWriteDeadline(time.Now().Add(writeTimeout)); err != nil {
				c.logger.Error("Failed to set write deadline", zap.Error(err))
				return
			}

			log.Println("conn: ", c.conn.RemoteAddr().String())
			if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				c.logger.Error("Failed to write ping message", zap.Error(err))
				return
			}

		}
	}
}

func (c *conn) heartBeat() {

	ticker := time.NewTicker(pingPeriod)
	defer func() {
		c.logger.Info("Heartbeat stopped cleaning up the connection")
		ticker.Stop()
		c.cleanup()
	}()

	//Here I need to implement some sort of ping pong mechanism to keep the connection alive
	c.conn.SetPongHandler(func(input string) error {

		c.logger.Info("Received pong", zap.String("input", input))

		c.lastPongAt = time.Now()
		if err := c.conn.SetReadDeadline(time.Now().Add(idleTimeout)); err != nil {
			c.logger.Error("Failed to set read deadline", zap.Error(err))
			c.cleanup()
		}

		return nil
	})

	for {
		select {
		case <-ticker.C:
			c.logger.Info("Sending heartbeat")
			c.heartbeatChannel <- []byte{}

		case <-c.shutdown:

			c.logger.Info("Forcing shutdown")
			return
		}
	}
}

func (c *conn) cleanup() {
	c.logger.Info("Cleaning up connection")

	c.cleanupOnce.Do(func() {

		close(c.shutdown)
		close(c.sendChannel)
		close(c.heartbeatChannel)

		// Close the underlying websocket connection.
		err := c.conn.Close()
		if err != nil {

			c.logger.Error("Failed to close connection", zap.Error(err))
		}
		c.logger.Info("Connection closed")

	})

}

func (c *conn) run() {
	c.logger.Info("New connection starting read, write and heartbeat pumps")

	go c.writePump()
	go c.heartBeat()

}

// Close closes the connection gracefully. It waits for all goroutines to finish.
func (c *conn) Close(wg *sync.WaitGroup) {
	defer wg.Done()
	c.writeClose()
	c.cleanup()
}

// writeClose sends a close message to the websocket connection.
func (c *conn) writeClose() {
	err := c.conn.WriteControl(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""), time.Now().Add(writeTimeout))
	if err != nil {
		c.logger.Error("failed to write close message", zap.Error(err))
	}
}
