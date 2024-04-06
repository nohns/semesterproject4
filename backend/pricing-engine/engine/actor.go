package engine

import (
	"math/rand"
	"sync"
	"time"
)

type actor struct {
	id         string
	terminated bool
	starter    sync.Once
	itm        item
	// orders chan receives quantities ordered
	orders chan int
	// params chan receives updates to item parameters
	params chan ItemParams
	// term chan terminates the actor
	term chan struct{}
	// out chan is for writing price updates back to the engine
	out chan<- PriceUpdate
	// t ticker schedules price updates to be outputted
	t *time.Ticker
	// econf holds the engine configuration. Replaces the need for globals
	econf Config
}

type actorConfig struct {
	params ItemParams
	out    chan<- PriceUpdate
	econf  Config
}

func newActor(id string, conf actorConfig) *actor {
	return &actor{
		id:     id,
		itm:    newItem(conf.params),
		orders: make(chan int),
		params: make(chan ItemParams),
		term:   make(chan struct{}),
		out:    conf.out,
		econf:  conf.econf,
	}
}

// Order notifies the actor that an order as been placed
func (a *actor) order(qty int) {
	a.orders <- qty
}

// Update params notifies the actor that params should be updated
func (a *actor) updateParams(params ItemParams) {
	a.params <- params
}

// Terminate shuts down the actor
func (a *actor) terminate() {
	a.term <- struct{}{}
	close(a.orders)
	close(a.params)
	close(a.term)
	a.t.Stop()
}

// Start intiates the pricing algorithm
func (a *actor) start() {
	a.starter.Do(func() {
		a.primeUpdateScheduler()

		go a.listen()
		a.orders <- 0 // 0 means initial order, see listen function
	})
}

// primeUpdateScheduler sleeps for a random delay between 0 and maxStartDelay, to make price updates
// seem more random, but still with a set interval between them, so graphs look nicer.
func (a *actor) primeUpdateScheduler() {
	if a.econf.FirstUpdateMaxDelay < 0 {
		delay := time.Duration(rand.Int63n(int64(a.econf.FirstUpdateMaxDelay)))
		time.Sleep(delay)
	}
	a.t = time.NewTicker(a.econf.UpdateInterval)
}

func (a *actor) listen() {
	for !a.terminated {
		select {
		case qty := <-a.orders:
			a.handleOrderPlaced(qty)
			// Initial order needs to produce a price update
			if qty == 0 {
				a.emitUpdate()
			}
		case <-a.t.C:
			a.emitUpdate()
		case params := <-a.params:
			a.handleParamsUpdated(params)
		case <-a.term:
			a.terminated = true
		}
	}
}

// handleOrderPlaced handles incoming order quantities. If quantity is a zero-value,
// it has the semantic meaning of resetting the last order time, and nothing else.
func (a *actor) handleOrderPlaced(qty int) {
	if qty == 0 {
		a.itm.reset()
		return
	}
	a.itm.order(qty)
}

// emitUpdate outputs an update of the current item price tracked by the actor.
func (a *actor) emitUpdate() {
	a.out <- PriceUpdate{
		Id:    a.id,
		Price: a.itm.price(),
		At:    time.Now(),
	}
}

// handleParamsUpdated tweaks the pricing parameters when the actor is running.
func (a *actor) handleParamsUpdated(params ItemParams) {
	a.itm.tweakParams(params)
}
