package websocket

import (
	"log/slog"
	"sync"
	"time"

	"github.com/gorilla/websocket"
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
	id               string
	sendChannel      chan []byte
	heartbeatChannel chan []byte
	shutdown         chan any
	cleanupOnce      *sync.Once

	logger *slog.Logger

	lastPongAt time.Time
}

type connOptions struct {
	conn   *websocket.Conn
	id     string
	logger *slog.Logger
}

func newConnection(o *connOptions) *conn {
	now := time.Now()
	return &conn{
		conn:             o.conn,
		id:               o.id,
		sendChannel:      make(chan []byte, sendBufferSize),
		heartbeatChannel: make(chan []byte, recieveBufferSize),
		shutdown:         make(chan interface{}),
		cleanupOnce:      &sync.Once{},
		logger:           o.logger,
		lastPongAt:       now,
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
				c.logger.Error("Failed to set write deadline", slog.String("error", err.Error()))
				return
			}

			if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {

				c.logger.Error("Failed to write message", slog.String("error", err.Error()))
				return
			}
			c.logger.Info("Message sent")

			//Send ping messages to the websocket connection
		case _, ok := <-c.heartbeatChannel:
			if !ok {
				return
			}
			if err := c.conn.SetWriteDeadline(time.Now().Add(writeTimeout)); err != nil {
				c.logger.Error("Failed to set write deadline", slog.String("error", err.Error()))
				return
			}

			if err := c.conn.WriteControl(websocket.PingMessage, []byte("PING"), time.Now().Add(writeTimeout)); err != nil {
				c.logger.Error("Failed to write control ping message", slog.String("error", err.Error()))
				return
			}

		}
	}
}

func (c *conn) readPump() {
	c.logger.Info("Read pump started")
	defer func() {
		c.logger.Debug("read pump stopped")
		c.cleanup()
	}()

	c.conn.SetReadLimit(recieveBufferSize)
	if err := c.conn.SetReadDeadline(time.Now().Add(idleTimeout)); err != nil {
		c.logger.Error("failed to set read deadline", slog.String("error", err.Error()))
	}

	//Here I need to implement some sort of ping pong mechanism to keep the connection alive
	c.conn.SetPongHandler(func(s string) error {
		c.logger.Info("Received pong", slog.String("data", s))
		c.lastPongAt = time.Now()
		if err := c.conn.SetReadDeadline(time.Now().Add(idleTimeout)); err != nil {
			c.logger.Error("Failed to set read deadline", slog.String("error", err.Error()))
			c.cleanup()
		}
		return nil
	})

	errC := make(chan error, 1)

	go func() {
		for {
			//Listen for ping messages and respond

			if _, _, err := c.conn.NextReader(); err != nil {
				errC <- err
				return
			}
		}
	}()

	for {
		select {
		case err := <-errC:
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				// If the connection is closed, increment metric for closing
				c.logger.Debug("websocket connection closed unexpectedly", slog.String("error", err.Error()))
			} else {
				// Otherwise we failed to read from the connection, increment metric for failure
				c.logger.Error("failed to read from connection", slog.String("error", err.Error()))
			}
			return

		case <-c.shutdown:
			return
		}
	}

}

// We need heartbeat to act as the reader goroutine
func (c *conn) heartBeat() {

	c.logger.Info("Heartbeat started")
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		c.logger.Info("Heartbeat stopped cleaning up the connection")
		ticker.Stop()
		c.cleanup()
	}()

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
		c.logger.Debug("CLEANUP ONCE")

		close(c.shutdown)
		close(c.sendChannel)
		close(c.heartbeatChannel)

		// Close the underlying websocket connection.
		err := c.conn.Close()
		if err != nil {
			c.logger.Error("Failed to close connection", slog.String("error", err.Error()))
		}
		c.logger.Info("Connection closed")
	})
	c.logger.Info("outside of cleanup once")
}

func (c *conn) run() {
	c.logger.Info("New connection starting read, write and heartbeat pumps")
	go c.writePump()
	go c.readPump()
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
		c.logger.Error("failed to write close message", slog.String("error", err.Error()))
	}
}
