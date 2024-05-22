package trigger

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"golang.org/x/net/context"
)

type triggerHandler interface {
	BevUpdated(ctx context.Context, bevID string) error
	BevOrdered(ctx context.Context, bevID string, qty int) error
	BevAdded(ctx context.Context, bevID string) error
	BevRemoved(ctx context.Context, bevID string) error
}

type server struct {
	addr   string
	logger *slog.Logger
	th     triggerHandler
}

func New(addr string, logger *slog.Logger, th triggerHandler) *server {
	return &server{
		addr:   addr,
		logger: logger,
		th:     th,
	}
}

func (s *server) ListenAndServe() error {
	router := http.NewServeMux()

	// Initialize server
	httpsrv := &http.Server{
		Addr:         s.addr,
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}
	type idBody struct {
		ID int `json:"beverageId"`
	}

	// Initialize routes
	router.HandleFunc("POST /beverageUpdated", func(w http.ResponseWriter, r *http.Request) {
		// Handle update
		s.logger.Info("Received update request")

		var body idBody
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			s.logger.Error("Failed to decode request", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if body.ID == 0 {
			s.logger.Error("Invalid beverage id given in bev updated trigger")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if err := s.th.BevUpdated(r.Context(), strconv.Itoa(body.ID)); err != nil {
			s.logger.Error("Failed to handle bev updated", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	router.HandleFunc("POST /beverageOrdered", func(w http.ResponseWriter, r *http.Request) {
		// Handle purchase
		s.logger.Info("Received order request")

		var body struct {
			ID  int `json:"beverageId"`
			Qty int `json:"qty"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			s.logger.Error("Failed to json decode request", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if body.ID == 0 {
			s.logger.Error("Invalid beverage id given in bev added trigger")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if err := s.th.BevOrdered(r.Context(), strconv.Itoa(body.ID), body.Qty); err != nil {
			s.logger.Error("Failed to handle bev ordered", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	router.HandleFunc("POST /beverageAdded", func(w http.ResponseWriter, r *http.Request) {
		// Handle add
		s.logger.Info("Received add request")

		var body idBody
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			s.logger.Error("Failed to decode request", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if body.ID == 0 {
			s.logger.Error("Invalid beverage id given in bev added trigger")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if err := s.th.BevAdded(r.Context(), strconv.Itoa(body.ID)); err != nil {
			s.logger.Error("Failed to handle bev added", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	router.HandleFunc("POST /beverageRemoved", func(w http.ResponseWriter, r *http.Request) {
		// Handle remove
		s.logger.Info("Received remove request")

		var body idBody
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			s.logger.Error("Failed to decode request", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if body.ID == 0 {
			s.logger.Error("Invalid beverage id given in bev removed trigger")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if err := s.th.BevRemoved(r.Context(), strconv.Itoa(body.ID)); err != nil {
			s.logger.Error("Failed to handle bev removed", slog.String("error", err.Error()))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	if err := httpsrv.ListenAndServe(); err != nil {
		s.logger.Error("Failed to start server,", slog.String("error", err.Error()))
	}

	return nil
}
