package trigger

import (
	"encoding/json"
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
	router.HandleFunc("/beverageUpdated", func(w http.ResponseWriter, r *http.Request) {
		// Handle update
		this.Logger.Info("Received update request")

		var request struct {
			ID string `json:"beverageId"`
		}

		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			this.Logger.Error("Failed to decode request", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Update beverage
	})

	router.HandleFunc("/beveragePurchased", func(w http.ResponseWriter, r *http.Request) {
		// Handle purchase
		this.Logger.Info("Received purchase request")

		var request struct {
			ID string `json:"beverageId"`
		}

		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			this.Logger.Error("Failed to decode request", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusBadRequest)
			return
		}

	})

	router.HandleFunc("/beverageAdded", func(w http.ResponseWriter, r *http.Request) {
		// Handle add
		this.Logger.Info("Received add request")

	})

	router.HandleFunc("/beverageRemoved", func(w http.ResponseWriter, r *http.Request) {
		// Handle remove
		this.Logger.Info("Received remove request")
	})

	if err := s.ListenAndServe(); err != nil {
		this.Logger.Error("Failed to start server,", slog.String("error", err.Error()))
	}

	return nil
}
