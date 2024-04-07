package pe

import "time"

type Msg[T any] struct {
	Kind string `json:"kind"`
	Data T      `json:"data"`
}

func newUpdateMsg(u Update) Msg[Update] {
	return Msg[Update]{
		Kind: "priceUpdate",
		Data: u,
	}
}

type History struct {
	Beverage Beverage       `json:"beverage"`
	Prices   []HistoryEntry `json:"prices"`
}

type HistoryEntry struct {
	Price float64   `json:"price"`
	At    time.Time `json:"at"`
}

func NewHistoryMsg(h []History) Msg[[]History] {
	return Msg[[]History]{
		Kind: "priceHistories",
		Data: h,
	}
}
