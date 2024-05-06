package app

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"time"

	pe "github.com/nohns/semesterproject4"
	"github.com/nohns/semesterproject4/engine"
	"github.com/nohns/semesterproject4/mock"
	"github.com/nohns/semesterproject4/websocket"

	_ "net/http/pprof"
)

type app struct {
	priceStorer  pe.PriceStorer
	histProvider pe.HistoryProvider
	bevRepo      pe.BeverageRepo
	currPricer   pe.CurrPricer
	logger       *slog.Logger
	sockMan      *websocket.Manager
	priceEngine  *engine.Engine
}

func BootstrapMocked() (*app, error) {
	a := &app{
		priceStorer:  &mock.Data,
		histProvider: &mock.Data,
		bevRepo:      &mock.Data,
		currPricer:   &mock.Data,
		logger: slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelDebug,
		})),
	}

	// Websocket manager needs a pointer to whatever owns the entirety of the draw graphs data that must be send on initial connection
	sockman, err := websocket.NewManager(&websocket.ManagerOptions{
		Addr:         ":9090",
		Logger:       a.logger,
		InitConnFunc: a.onInitialConn,
	})
	if err != nil {
		a.logger.Error("Failed to initialize websocket manager,", slog.String("error", err.Error()))
	}
	a.sockMan = sockman

	// Configure pricing engine, and track beverages
	eng := engine.New(engine.Config{
		FirstUpdateMode: engine.FirstUpdateModeFollow,
		UpdateInterval:  10 * time.Second,
	})
	bevs, err := a.bevRepo.FindBeverages(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("failed to get beverages: %v", err)
	}
	for _, bev := range bevs {
		price, err := a.currPricer.CurrentPrice(context.TODO(), bev.ID)
		if err != nil {
			return nil, fmt.Errorf("failed to get current price: %v", err)
		}

		err = eng.TrackItem(bev.ID, engine.ItemParams{
			MaxPrice:      bev.Params.MaxPrice,
			MinPrice:      bev.Params.MinPrice,
			InitialPrice:  price,
			BuyMultiplier: bev.Params.BuyMultiplier,
			HalfTime:      int(bev.Params.HalfTime / time.Second),
		})
		if err != nil {
			return nil, fmt.Errorf("failed to track item: %v", err)
		}
		// go a.tempSimulateDemand(bev)
	}
	a.priceEngine = eng

	return a, nil
}

// Temporary method to simulate random demand
func (a *app) tempSimulateDemand(bev pe.Beverage) {
	for {
		minsec := 20 + rand.Intn(20)
		maxsec := minsec + rand.Intn(60-minsec)

		// Sleep for random time to simulate martin buying all the drinks🤯
		sleeptime := minsec + rand.Intn(maxsec-minsec+1)
		time.Sleep(time.Duration(sleeptime) * time.Second)

		qty := 1 + rand.Intn(2)
		a.logger.Debug("Buying item", slog.String("itemID", bev.ID), slog.Int("qty", qty))
		if err := a.priceEngine.OrderItem(bev.ID, qty); err != nil {
			a.logger.Error("Failed to simulate ordering", slog.String("itemID", bev.ID), slog.String("error", err.Error()))
			return
		}
	}
}

func (a *app) Run(ctx context.Context) error {
	go a.serveHTTP()
	go a.serveWS()
	defer a.sockMan.Stop()

	// Run pricing engine and broadcast updates
	a.priceEngine.Start()
	go a.handlePriceUpdates()
	defer a.priceEngine.Terminate()

	bevs, err := a.bevRepo.FindBeverages(context.TODO())
	if err != nil {
		return fmt.Errorf("failed to get beverages: %v", err)
	}
	for _, bev := range bevs {
		go a.tempSimulateDemand(bev)
	}

	// Blocking to keep the main process alive
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt /*, syscall.SIGTERM*/)
	<-signals

	return fmt.Errorf("recv termination")
}

func (a *app) serveWS() {
	if err := a.sockMan.ListenAndServe(); err != nil {
		a.logger.Error("Failed to start websocket manager,", slog.String("error", err.Error()))
	}
}

func (a *app) serveHTTP() {
	a.logger.Error("Failed to serve http", slog.String("error", http.ListenAndServe("localhost:6060", nil).Error()))
}

func (a *app) handlePriceUpdates() {
	for {
		u, err := a.priceEngine.ReadUpdate()
		if err != nil {
			a.logger.Error("Could not read update from pricing engine,", slog.String("error", err.Error()))
			return
		}
		a.logger.Info("Received price update", slog.Any("update", u))

		err = a.priceStorer.StorePrice(context.TODO(), pe.Update{
			BevID: u.Id,
			Price: u.Price,
			At:    u.At,
		})
		if err != nil {
			a.logger.Error("Could not store price update", slog.String("error", err.Error()), slog.Any("update", u))
			return
		}

		msg := pe.NewUpdateMsg(pe.Update{
			BevID: u.Id,
			Price: u.Price,
			At:    u.At,
		})
		b, err := json.Marshal(msg)
		if err != nil {
			a.logger.Error("Could not marshal price update msg,", slog.String("error", err.Error()), slog.Any("msg", msg))
			return
		}
		a.sockMan.Broadcast(b)
	}
}

func (a *app) onInitialConn(c *websocket.Conn) {
	// Gather price histories
	histories, err := a.histProvider.Histories(context.TODO())
	if err != nil {
		a.logger.Error("Failed to get histories when initiating ws connection", slog.String("error", err.Error()))
		c.Close()
		return
	}
	// Convert to message to be sent to frontend
	b, err := json.Marshal(pe.NewHistoryMsg(histories))
	if err != nil {
		a.logger.Error("Failed to json marshal histories when initiating ws connection", slog.String("error", err.Error()))
		c.Close()
		return
	}
	c.Send(b)
}
