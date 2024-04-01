package websocket

import (
	"context"
	"log/slog"

	"github.com/go-redis/redis/v8"
	"go.uber.org/zap"
)

type client struct {
	conn *conn
	id   string

	logger *slog.Logger

	broker Broker
}

type clientOptions struct {
	conn *conn
	id   string

	logger *slog.Logger

	broker Broker
}

func newClient(o *clientOptions) *client {
	return &client{

		conn: o.conn,
		id:   o.id,

		broker: o.broker,

		logger: o.logger,
	}
}

// TODO: unsure if this is just going to turbo spin
func (c *client) handleMessages(ch <-chan *redis.Message) {
	for range ch {

		c.logger.Info("Handling incoming redis message")
		msg, ok := <-ch
		if !ok {
			return
		}
		//convert msg.Payload to slice of bytes
		c.conn.sendChannel <- []byte(msg.Payload)

	}
}

func (c *client) run() {
	//Start read, write and heartbeat goroutines
	c.conn.run()

	pubsub, err := c.broker.Subscribe(context.TODO())
	if err != nil {
		c.logger.Error("Failed to subscribe to channel", zap.Error(err))
		return
	}

	//Blocking call to handle messages
	c.handleMessages(pubsub.Channel())
	c.logger.Info("Client run stopped")

	//Close the pubsub channel
	err = c.broker.Unsubscribe(context.TODO(), pubsub)
	if err != nil {
		c.logger.Error("Failed to unsubscribe from channel", zap.Error(err))
		return
	}
	pubsub.Close()

	c.logger.Info("Client unsubscribed from pubsub channels")

}
