package mock

import (
	"context"
	"errors"
	"fmt"

	pe "github.com/nohns/semesterproject4"
)

func (pm *mockData) FindBeverages(ctx context.Context) ([]pe.Beverage, error) {
	bevs := make([]pe.Beverage, 0, len(pm.bevs))
	for _, h := range pm.histories {
		bevs = append(bevs, h.Beverage)
	}
	return bevs, nil
}

func (pm *mockData) BeverageByID(ctx context.Context, bevID string) (pe.Beverage, error) {
	for _, h := range pm.histories {
		if h.Beverage.ID == bevID {
			return h.Beverage, nil
		}
	}
	return pe.Beverage{}, errors.New("beverage not found")
}

func (pm *mockData) History(ctx context.Context, bevID string) (pe.History, error) {
	for _, h := range pm.histories {
		if h.Beverage.ID == bevID {
			return h, nil
		}
	}
	return pe.History{}, fmt.Errorf("history associated with beverage id %s not found", bevID)
}

func (pm *mockData) Histories(ctx context.Context) ([]pe.History, error) {
	return pm.histories, nil
}

func (pm *mockData) CurrentPrice(ctx context.Context, bevID string) (float64, error) {
	h, err := pm.History(ctx, bevID)
	if err != nil {
		return 0, err
	}
	return h.Prices[len(h.Prices)-1].Price, nil
}

func (pm *mockData) StorePrice(ctx context.Context, u pe.Update) error {
	for i, h := range pm.histories {
		if h.Beverage.ID == u.BevID {
			pm.histories[i].Beverage.LastPriceUpdate = u.At
			pm.histories[i].Prices = append(pm.histories[i].Prices, pe.HistoryEntry{
				Price: u.Price,
				At:    u.At,
			})
		}
	}
	return nil
}
