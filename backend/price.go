package pe

import (
	"context"
	"fmt"
	"time"
)

type Update struct {
	BevID string    `json:"bevId"`
	Price float64   `json:"price"`
	At    time.Time `json:"at"`
}

func (u Update) Validate() error {
	if u.BevID == "" {
		return fmt.Errorf("no bevId provided")
	}
	if u.Price <= 0 {
		return fmt.Errorf("price must be positive")
	}
	if u.At.IsZero() {
		return fmt.Errorf("no at time provided")
	}
	return nil
}

type MsgBroadcaster interface {
	Broadcast(msg any)
}

type PriceRepo interface {
	Store(ctx context.Context, u Update) error
}

type HistoryProvider interface {
	History(ctx context.Context, bevId string) (History, error)
	Histories(ctx context.Context) ([]History, error)
}

type PricingSvc struct {
	broadcaster MsgBroadcaster
	repo        PriceRepo
	hp          HistoryProvider
}

func NewPricingSvc(broadcaster MsgBroadcaster) *PricingSvc {
	return &PricingSvc{
		broadcaster: broadcaster,
	}
}

// UpdatePrice persists a price update of a beverage and broadcasts the update
func (p *PricingSvc) UpdatePrice(ctx context.Context, u Update) error {
	if err := u.Validate(); err != nil {
		return err
	}

	if err := p.repo.Store(ctx, u); err != nil {
		return err
	}

	p.broadcaster.Broadcast(newUpdateMsg(u))
	return nil
}
