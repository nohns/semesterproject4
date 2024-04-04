package websocket

import (
	"log/slog"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"

	"github.com/gorilla/websocket"
)

type manager struct {
	addr string

	clients map[string]*conn

	upgrader websocket.Upgrader

	mu sync.RWMutex

	logger *slog.Logger
}

type ManagerOptions struct {
	Addr string

	Logger *slog.Logger
}

func NewWebsocketManager(o *ManagerOptions) (*manager, error) {

	if o.Addr == "" {
		o.Addr = ":10000"
		o.Logger.Info("No port specified, defaulting to 10000")
	}

	return &manager{
		addr: o.Addr,

		clients: make(map[string]*conn),

		mu: sync.RWMutex{},

		logger: o.Logger,

		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}, nil
}

func (m *manager) Broadcast(message []byte) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	for _, client := range m.clients {

		select {
		case client.sendChannel <- message:
		default:
			m.logger.Debug("Failed to send message to client", slog.String("clientID", client.id))
		}
	}
}

func (m *manager) upgradeHandler(w http.ResponseWriter, r *http.Request) {

	conn, err := m.upgrader.Upgrade(w, r, nil)
	if err != nil {
		m.logger.Debug("Failed to upgrade connection", slog.String("error", err.Error()), slog.String("remote_addr", r.RemoteAddr))
		return
	}

	ws := newConnection(&connOptions{conn: conn,
		id:     uuid.Must(uuid.NewRandom()).String(),
		logger: m.logger,
	})

	m.addClient(ws)
	defer m.removeClient(ws)

	ws.run()

	//We need to send the initial data here when the connection is established
	ws.sendChannel <- []byte("This is the large amount of big data we need to send once 🤬")

	//blocking statement until we are forced to cleanup
	<-ws.shutdown

}

func (m *manager) addClient(c *conn) {
	m.logger.Info("Adding client", slog.String("id", c.id))

	m.mu.Lock()
	defer m.mu.Unlock()

	m.clients[c.id] = c
	m.logger.Info("Total clients", slog.Int("count", len(m.clients)))
}

func (m *manager) removeClient(c *conn) {
	m.logger.Info("Removing client", slog.String("id", c.id))

	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.clients, c.id)
	m.logger.Info("Total clients", slog.Int("count", len(m.clients)))
}

func (m *manager) ListenAndServe() error {

	router := http.NewServeMux()

	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		m.logger.Info("Websocket connection request received")
		m.upgradeHandler(w, r)
	})

	//Sane defaults
	srv := &http.Server{
		Handler:           router,
		Addr:              m.addr,
		ReadTimeout:       5 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	m.logger.Info("Starting websocket server on port: " + m.addr)
	err := srv.ListenAndServe()
	if err != nil {
		m.logger.Error("Failed to start websocket server", slog.String("error", err.Error()))
		return err
	}
	m.logger.Info("Websocket server started on port " + m.addr)

	return nil
}

func (m *manager) Stop() {

	wg := &sync.WaitGroup{}
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, client := range m.clients {
		wg.Add(1)
		go client.Close(wg)
	}
	wg.Wait()
	m.logger.Info("Websocket server stopped")
}
