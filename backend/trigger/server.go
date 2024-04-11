package trigger

import (
	"log/slog"
	"net/http"
	"time"
)

type server struct {
	Addr   string
	Logger *slog.Logger
}

func New(addr string, logger *slog.Logger) *server {
	return &server{
		Addr:   addr,
		Logger: logger,
	}
}

func (this *server) ListenAndServe() error {

	router := http.NewServeMux()

	// Initialize server
	s := &http.Server{
		Addr:         this.Addr,
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	// Initialize routes
	router.HandleFunc("/update", func(w http.ResponseWriter, r *http.Request) {
		// Handle update
		this.Logger.Info("Received update request")

	})

	router.HandleFunc("/purchase", func(w http.ResponseWriter, r *http.Request) {
		// Handle purchase
		this.Logger.Info("Received purchase request")

	})

	if err := s.ListenAndServe(); err != nil {
		this.Logger.Error("Failed to start server,", slog.String("error", err.Error()))
	}

	return nil
}
