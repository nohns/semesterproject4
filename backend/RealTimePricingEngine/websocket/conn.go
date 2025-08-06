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

	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10 // send pings before connection times out

	// Max number of messages queued in send buffer.
	sendBufferSize = 200
)

type Conn struct {
	conn        *websocket.Conn
	id          string
	sendChannel chan []byte
	shutdown    chan any
	cleanupOnce *sync.Once

	logger *slog.Logger

	lastPongAt time.Time
}

type connOptions struct {
	conn   *websocket.Conn
	id     string
	logger *slog.Logger
}

func newConnection(o *connOptions) *Conn {
	now := time.Now()
	return &Conn{
		conn:        o.conn,
		id:          o.id,
		sendChannel: make(chan []byte, sendBufferSize),
		shutdown:    make(chan interface{}),
		cleanupOnce: &sync.Once{},
		logger:      o.logger,
		lastPongAt:  now,
	}
}

func (c *Conn) Send(msg []byte) {
	select {
	case c.sendChannel <- msg:
	default:
		c.logger.Error("Send buffer full, dropping message")
	}
}

func (c *Conn) writePump() {
	c.logger.Info("Write pump started")
	ticker := time.NewTicker(pingPeriod)

	defer func() {
		ticker.Stop()
		c.logger.Info("Write pump stopped")
		c.cleanup()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.sendChannel:
			// Set write deadline for all messages
			if err := c.conn.SetWriteDeadline(time.Now().Add(writeWait)); err != nil {
				c.logger.Error("Failed to set write deadline", slog.String("error", err.Error()))
				return
			}

			if !ok {
				c.logger.Info("Send channel closed")
				_ = c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.conn.WriteMessage(websocket.TextMessage, message); err != nil {
				c.logger.Error("Failed to write message", slog.String("error", err.Error()))
				return
			}
			c.logger.Info("Message sent")

		case <-ticker.C:
			// Send periodic ping
			if err := c.conn.SetWriteDeadline(time.Now().Add(writeWait)); err != nil {
				c.logger.Error("Failed to set write deadline", slog.String("error", err.Error()))
				return
			}

			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				c.logger.Error("Failed to send ping", slog.String("error", err.Error()))
				return
			}
			c.logger.Debug("Ping sent")

		case <-c.shutdown:
			return
		}
	}
}

func (c *Conn) readPump() {
	c.logger.Info("Read pump started")
	defer func() {
		c.logger.Info("Read pump stopped")
		c.cleanup()
		c.conn.Close()
	}()

	c.conn.SetReadLimit(512)
	_ = c.conn.SetReadDeadline(time.Now().Add(pongWait))

	c.conn.SetPongHandler(func(string) error {
		c.logger.Debug("Pong received")
		return c.conn.SetReadDeadline(time.Now().Add(pongWait))
	})

	for {
		_, _, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				c.logger.Error("Unexpected close error", slog.String("error", err.Error()))
			} else {
				c.logger.Info("Connection closed", slog.String("reason", err.Error()))
			}
			break
		}
	}
}

func (c *Conn) cleanup() {
	c.logger.Info("Cleaning up connection")
	c.cleanupOnce.Do(func() {
		c.logger.Debug("CLEANUP ONCE")

		close(c.shutdown)
		close(c.sendChannel)

		// Close the underlying websocket connection.
		err := c.conn.Close()
		if err != nil {
			c.logger.Error("Failed to close connection", slog.String("error", err.Error()))
		}
		c.logger.Info("Connection closed")
	})
	c.logger.Info("outside of cleanup once")
}

func (c *Conn) run() {
	c.logger.Info("New connection starting read, write and heartbeat pumps")
	go c.writePump()
	go c.readPump()
}

// Close closes the connection gracefully. It waits for all goroutines to finish.
func (c *Conn) Close() {
	c.writeClose()
	c.cleanup()
}

// writeClose sends a close message to the websocket connection.
func (c *Conn) writeClose() {
	err := c.conn.WriteControl(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""), time.Now().Add(writeTimeout))
	if err != nil {
		c.logger.Error("failed to write close message", slog.String("error", err.Error()))
	}
}
