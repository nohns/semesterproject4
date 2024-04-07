package mock

import (
	"context"
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
