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
	"github.com/nohns/semesterproject4/mysql"
	"github.com/nohns/semesterproject4/trigger"
	"github.com/nohns/semesterproject4/websocket"

	_ "net/http/pprof"
)

type app struct {
	priceStorer  pe.PriceStorer
	histProvider pe.HistoryProvider
	bevRepo      pe.BeverageRepo
	trigsrv      interface {
		ListenAndServe() error
	}
	conf        config
	logger      *slog.Logger
	sockMan     *websocket.Manager
	priceEngine *engine.Engine
}

func Bootstrap() (a *app, err error) {
	c := readConf()

	// Initialize the base dependencies for the app
	if c.mocked {
		a = makeBaseMocked(c)
	} else {
		a, err = makeBase(c)
		if err != nil {
			return nil, err
		}
	}

	// Websocket manager needs a pointer to whatever owns the entirety of the draw graphs data that must be send on initial connection
	sockman, err := websocket.NewManager(&websocket.ManagerOptions{
		Addr:         c.httpaddr,
		Logger:       a.logger,
		InitConnFunc: a.onInitialConn,
	})
	if err != nil {
		a.logger.Error("Failed to initialize websocket manager,", slog.String("error", err.Error()))
	}
	a.sockMan = sockman

	// Configure pricing engine, and track beverages
	eng := engine.New(engine.Config{
		FirstUpdateMode:           engine.FirstUpdateModeRandom,
		FirstUpdateRandomMaxDelay: 10 * time.Second,
		UpdateInterval:            10 * time.Second,
		NoisePerThousand:          25,
	})
	bevs, err := a.bevRepo.FindBeverages(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("failed to get beverages: %v", err)
	}
	for _, bev := range bevs {
		err = eng.TrackItem(bev.ID, toItemParams(bev))
		if err != nil {
			return nil, fmt.Errorf("failed to track item: %v", err)
		}
	}
	a.priceEngine = eng

	// Triggers for receiving notifications from ASP.NET backend
	a.trigsrv = trigger.New(c.trigaddr, a.logger, a) // Use the app itself as the trigger handler

	return a, nil
}

// makeBase initializes the app. Afterwards, other dependencies should be bootstraped.
func makeBase(c config) (*app, error) {
	db, err := mysql.Open(c.dbconnstr)
	if err != nil {
		return nil, fmt.Errorf("mysql open: %v", err)
	}
	var (
		ps      = mysql.NewPriceStorer(db)
		hp      = mysql.NewHistoryProvider(db)
		bevrepo = mysql.NewBeverageRepo(db)
	)

	return &app{
		conf:         c,
		priceStorer:  ps,
		histProvider: hp,
		bevRepo:      bevrepo,
		logger: slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: c.loglvl,
		})),
	}, nil
}

func makeBaseMocked(c config) *app {
	return &app{
		conf:         c,
		priceStorer:  &mock.Data,
		histProvider: &mock.Data,
		bevRepo:      &mock.Data,
		logger: slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: c.loglvl,
		})),
	}
}

// BevUpdated is a handler triggered when a bartender updates a beverage.
// Handler makes sure the updated beverages is reflected in the pricing of
// beverages. Satisfies the triggerHandler interface defined in trigger
// package.
func (a *app) BevUpdated(ctx context.Context, bevID string) error {
	bev, err := a.bevRepo.BeverageByID(ctx, bevID)
	if err != nil {
		return fmt.Errorf("bevrepo beverageByID: %v", err)
	}

	if !bev.IsActive {
		if err := a.priceEngine.UntrackItem(bev.ID); err != nil {
			return fmt.Errorf("engine untrackItem: %v", err)
		}
		return nil
	}

	if err := a.priceEngine.TrackItem(bev.ID, toItemParams(bev)); err != nil {
		if err == engine.ErrItemAlreadyTracked {
			if err := a.priceEngine.TweakItem(bev.ID, toItemParams(bev)); err != nil {
				return fmt.Errorf("engine tweakItem: %v", err)
			}
			return nil
		}
		return fmt.Errorf("engine trackItem: %v", err)
	}

	return nil
}

// BevOrdered is a handler triggered when an order has been furfilled. Handler
// notifies the pricing engine of the increased demand. Satisfies the
// triggerHandler interface defined in trigger package.
func (a *app) BevOrdered(ctx context.Context, bevID string, qty int) error {
	if err := a.priceEngine.OrderItem(bevID, qty); err != nil {
		return fmt.Errorf("engine orderItem: %v", err)
	}
	return nil
}

// BevAdded is a handler triggered when a new beverage is added to system.
// Handler makes sure that the new beverage's price is tracked in the engine.
// Satisfies the triggerHandler interface defined in trigger package.
func (a *app) BevAdded(ctx context.Context, bevID string) error {
	bev, err := a.bevRepo.BeverageByID(ctx, bevID)
	if err != nil {
		return fmt.Errorf("bevrepo beverageByID: %v", err)
	}

	if !bev.IsActive {
		return nil
	}

	if err := a.priceEngine.TrackItem(bevID, toItemParams(bev)); err != nil {
		return fmt.Errorf("engine untrackItem: %v", err)
	}
	return nil
}

// BevRemoved is a handler triggered when a beverage is removed by a bartender.
// Handler untracks the beverage in the engine. Satisfies the triggerHandler
// interface defined in trigger package.
func (a *app) BevRemoved(ctx context.Context, bevID string) error {
	if err := a.priceEngine.UntrackItem(bevID); err != nil {
		return fmt.Errorf("engine untrackItem: %v", err)
	}
	return nil
}

func (a *app) Run(ctx context.Context) error {
	go a.serveHTTP()
	go a.serveWS()
	defer a.sockMan.Stop()

	// Run pricing engine and broadcast updates
	a.priceEngine.Start()
	go a.handlePriceUpdates()
	defer a.priceEngine.Terminate()

	// Simulate demand when running in mocked
	if a.conf.mocked {
		bevs, err := a.bevRepo.FindBeverages(context.TODO())
		if err != nil {
			return fmt.Errorf("failed to get beverages: %v", err)
		}
		for _, bev := range bevs {
			go a.tempSimulateDemand(bev)
		}
	}

	// Listen for notification triggers
	go a.trigsrv.ListenAndServe()

	// Blocking to keep the main process alive
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt /*, syscall.SIGTERM*/)
	<-signals

	return fmt.Errorf("recv termination")
}

// Temporary method to simulate random demand
func (a *app) tempSimulateDemand(bev pe.Beverage) {
	for {
		minsec := 15 + rand.Intn(20)
		maxsec := minsec + rand.Intn(50-minsec)

		// Sleep for random time to simulate martin buying all the drinks🤯
		sleeptime := minsec + rand.Intn(maxsec-minsec+1)
		time.Sleep(time.Duration(sleeptime) * time.Second)

		qty := 1 + rand.Intn(4)
		a.logger.Debug("Buying item", slog.String("itemID", bev.ID), slog.Int("qty", qty))
		if err := a.priceEngine.OrderItem(bev.ID, qty); err != nil {
			a.logger.Error("Failed to simulate ordering", slog.String("itemID", bev.ID), slog.String("error", err.Error()))
			return
		}
	}
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

func toItemParams(bev pe.Beverage) engine.ItemParams {
	return engine.ItemParams{
		MaxPrice:      bev.Params.MaxPrice,
		MinPrice:      bev.Params.MinPrice,
		InitialPrice:  bev.Params.BasePrice,
		BuyMultiplier: bev.Params.BuyMultiplier,
		HalfTime:      int(bev.Params.HalfTime / time.Second),
		LastUpdate:    bev.LastPriceUpdate,
	}
}
