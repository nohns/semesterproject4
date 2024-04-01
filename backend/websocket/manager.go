package websocket

import (
	"context"
	"log/slog"
	"net/http"
	"sync"

	"github.com/google/uuid"

	"github.com/gorilla/websocket"
)

type manager struct {
	addr string
	//Key is userID
	clients map[string]*client

	upgrader websocket.Upgrader

	mu sync.RWMutex

	logger *slog.Logger

	/* broker Broker */
}

type ManagerOptions struct {
	Addr string

	Logger *slog.Logger

	/* Broker Broker */
}

/* type Broker interface {
	Subscribe(ctx context.Context) (*redis.PubSub, error)
	Unsubscribe(ctx context.Context, pubsub *redis.PubSub) error
	Publish(ctx context.Context, message []byte) error
} */

func NewWebsocketManager(o *ManagerOptions) (*manager, error) {

	if o.Addr == "" {
		o.Addr = ":10000"
		o.Logger.Info("No port specified, defaulting to 10000")
	}

	return &manager{
		addr: o.Addr,

		clients: make(map[string]*client),

		mu: sync.RWMutex{},

		logger: o.Logger,

		/* broker: o.Broker, */

		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}, nil
}

func (m *manager) upgradeHandler(w http.ResponseWriter, r *http.Request) {

	conn, err := m.upgrader.Upgrade(w, r, nil)
	if err != nil {
		m.logger.Debug("Failed to upgrade connection", slog.String("error", err.Error()), slog.String("remote_addr", r.RemoteAddr))
		return
	}

	ws := newConnection(&connOptions{conn: conn, logger: m.logger})

	client := newClient(&clientOptions{
		conn:   ws,
		id:     uuid.Must(uuid.NewRandom()).String(),
		logger: m.logger,
		/* broker: m.broker, */
	},
	)

	m.addClient(client)
	defer m.removeClient(client)

	client.run()

}

func (m *manager) addClient(c *client) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.clients[c.id] = c

}

func (m *manager) removeClient(c *client) {
	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.clients, c.id)

}

func (m *manager) ListenAndServe() error {

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		m.logger.Info("Websocket connection request received")
		m.upgradeHandler(w, r)
	})

	m.logger.Info("Starting websocket server on port: " + m.addr)
	//TODO PASS IN OPTIONS
	err := http.ListenAndServe(m.addr, nil)
	if err != nil {
		m.logger.Error("Failed to start websocket server", slog.String("error", err.Error()))
		return err
	}
	m.logger.Info("Websocket server started on port " + m.addr)

	return nil
}

// Method which closes all of the active websocket connections
func (m *manager) Stop(ctx context.Context) {

	wg := &sync.WaitGroup{}
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, client := range m.clients {
		wg.Add(1)
		go client.conn.Close(wg)
	}
	wg.Wait()

	m.logger.Info("Websocket server stopped")

}
