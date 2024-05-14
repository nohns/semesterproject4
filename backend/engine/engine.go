package engine

import (
	"errors"
	"fmt"
	"io"
	"sync"
	"time"
)

var (
	ErrItemAlreadyTracked = errors.New("item already tracked")
	ErrItemNotFound       = errors.New("item not found")
	ErrQuantityBelowOne   = errors.New("quantity below one")
	ErrItemParamsInvalid  = errors.New("item params invalid")
	ErrEngineNotIdle      = errors.New("engine not idle")
)

const (
	priceUpdateBufSize = 10 // Arbitrary size, which seems like a good fit :)
)

type PriceUpdate struct {
	Id    string
	Price float64
	At    time.Time
}

type engineState int

const (
	engineStateIdle engineState = iota
	engineStateRunning
	engineStateTerminated
)

type Engine struct {
	// actors keeps track of actors registered. ONLY interact with it when mu lock is acquired
	actors map[string]*actor

	actorout chan PriceUpdate
	updates  chan PriceUpdate

	state engineState
	// conf is set when New() is called. Should be read-only from here on out.
	conf Config
	mu   sync.RWMutex
}

type firstUpdateMode int

const (
	FirstUpdateModeFollow firstUpdateMode = iota
	FirstUpdateModeRandom
)

type Config struct {
	// FirstUpdateMode is how the pricing engine decides when to start publishing its updates.
	//  - FirstUpdateModeFollow (default) looks at the last time the item was updated, and uses
	//    that information to trigger first update next time a multiple of UpdateInterval is encountered.
	//  - FirstUpdateModeRandom triggers first update with a delay from 0 to FirstUpdateRandomMaxDelay.
	FirstUpdateMode firstUpdateMode

	// FirstUpdateRandomMaxDelay is the maximum delay before the first price update is sent. The actual
	// delay is a random value between 0 and FirstUpdateRandomMaxDelay, to simulate a more realistic
	// price development.
	FirstUpdateRandomMaxDelay time.Duration

	// UpdateInterval is the interval between price updates.
	UpdateInterval time.Duration

	// NoisePerThousand is the multiplier (divided by 1000) which the price
	// updates can sway away from the mathematically calculated price. It is also
	// applied to the new price when ordering an item. E.g a NoisePerThousand of
	// 25 (default) means swaying +/-2,5%.
	NoisePerThousand int
}

var DefaultConfig = Config{
	FirstUpdateRandomMaxDelay: 10 * time.Second,
	UpdateInterval:            30 * time.Second,
	NoisePerThousand:          25,
}

// New instantiates a pricing engine, which can track items over time.
func New(conf Config) *Engine {
	return &Engine{
		actors:   make(map[string]*actor),
		actorout: make(chan PriceUpdate),
		updates:  make(chan PriceUpdate),
		state:    engineStateIdle,
		conf:     conf,
	}
}

type ItemParams struct {
	MaxPrice float64
	MinPrice float64

	// InitialPrice is the price of the item at the LastOrdered time.
	InitialPrice float64

	// BuyMultiplier is the multiplier that decides how much the price
	// of an item increases when exactly one is ordered.
	BuyMultiplier float64

	// HalfTime specifies the amount of time before a price reaches half
	// its orignal price, assuming no orders placed.
	HalfTime int

	// LastUpdate is the last time the item was updated.
	LastUpdate time.Time
}

func (ip *ItemParams) validate() error {
	if ip.MaxPrice < ip.MinPrice {
		return fmt.Errorf("%w: max price must be larger than min price", ErrItemParamsInvalid)
	}
	if ip.BuyMultiplier < 1 {
		return fmt.Errorf("%w: buy multiplier must be larger than 1", ErrItemParamsInvalid)
	}
	if ip.HalfTime <= 1 {
		return fmt.Errorf("%w: half time must be greater than or equal to 1 second", ErrItemParamsInvalid)
	}
	if ip.MaxPrice < ip.InitialPrice || ip.MinPrice > ip.InitialPrice {
		return fmt.Errorf("%w: intial price must be between min and max price", ErrItemParamsInvalid)
	}
	return nil
}

// Track item registers an item, so the engine later can track its price.
func (e *Engine) TrackItem(id string, params ItemParams) error {
	if err := params.validate(); err != nil {
		return err
	}

	e.mu.Lock()
	defer e.mu.Unlock()

	if _, ok := e.actors[id]; ok {
		return ErrItemAlreadyTracked
	}
	e.actors[id] = newActor(id, actorConfig{
		params: params,
		out:    e.updates,
		econf:  e.conf,
	})

	return nil
}

// Order item takes the id of a given item and the quantity ordered and proceeds to
// increase the price.
func (e *Engine) OrderItem(id string, qty int) error {
	if qty < 1 {
		return ErrQuantityBelowOne
	}
	a, err := e.actor(id)
	if err != nil {
		return err
	}

	a.order(qty)
	return nil
}

// Tweak an items param while engine is running.
func (e *Engine) TweakItem(id string, newparams ItemParams) error {
	if err := newparams.validate(); err != nil {
		return err
	}

	a, err := e.actor(id)
	if err != nil {
		return err
	}

	a.updateParams(newparams)
	return nil
}

func (e *Engine) actor(id string) (*actor, error) {
	e.mu.RLock()
	defer e.mu.RUnlock()

	a, ok := e.actors[id]
	if !ok {
		return nil, ErrItemNotFound
	}

	return a, nil
}

// Read update gets the next update in the queue. When engine is started it is imperative,
// that this method is called continuously, otherwise the actors will all stall.
//
// Secondly, the goroutine from where this method is called, must not call any of the
// engine mutating methods. Doing so, will most certainly result in a deadlock as nobody
// is then flusing updates out of the engine.
func (e *Engine) ReadUpdate() (PriceUpdate, error) {
	u, ok := <-e.updates
	if !ok {
		return PriceUpdate{}, io.EOF
	}
	return u, nil
}

// Start will fire up the item price tracking, and the engine will start producing price updates.
func (e *Engine) Start() error {
	e.mu.Lock()
	defer e.mu.Unlock()

	// Engine only able to start when idling beforehand
	// TODO: make better errors
	if e.state != engineStateIdle {
		return ErrEngineNotIdle
	}
	e.state = engineStateRunning

	for _, a := range e.actors {
		go a.start()
	}

	return nil
}

// Terminate stops the tracking of items. When called, engine can no longer be used.
func (e *Engine) Terminate() {
	var wg sync.WaitGroup
	wg.Add(len(e.actors))

	e.mu.Lock()
	e.state = engineStateTerminated
	for id, a := range e.actors {
		go func() {
			a.terminate()
			wg.Done()
		}()
		delete(e.actors, id)
	}
	e.mu.Unlock()

	wg.Wait()
	close(e.actorout)
	close(e.updates)
}
