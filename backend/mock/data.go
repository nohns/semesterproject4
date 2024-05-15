package mock

import (
	"time"

	pe "github.com/nohns/semesterproject4"
)

type mockData struct {
	bevs      []bevItem
	histories []pe.History
}

type bevItem struct {
	id string
	b  pe.Beverage
	h  pe.History
}

var Data = makeMock()

func makeMock() mockData {
	m := mockData{
		histories: []pe.History{
			{
				Beverage: pe.Beverage{
					ID:              "1",
					Name:            "Blå vand",
					Desc:            "Den er rimelig fucking blå og så er der vand i",
					ImageSrc:        "/images/vand.jpg",
					LastPriceUpdate: time.Now().Add(-7 * time.Second),
					Params: pe.PricingParams{
						MaxPrice:      50,
						MinPrice:      15,
						BuyMultiplier: 1.025,
						HalfTime:      2 * time.Minute,
					},
				},
				Prices: []pe.HistoryEntry{
					{
						Price: 35.42,
					},
					{
						Price: 30.76,
					},
					{
						Price: 32.54,
					},
					{
						Price: 28.39,
					},
					{
						Price: 29.65,
					},
					{
						Price: 31.41,
					},
					{
						Price: 33.56,
					},
					{
						Price: 30.45,
					},
					{
						Price: 32.33,
					},
				},
			},
			{
				Beverage: pe.Beverage{
					ID:              "2",
					Name:            "Ceres Top",
					Desc:            "Fin aarhus øl ja tak",
					ImageSrc:        "/images/bajselademad.jpg",
					LastPriceUpdate: time.Now().Add(-9 * time.Second),
					Params: pe.PricingParams{
						MaxPrice:      25,
						MinPrice:      10,
						BuyMultiplier: 1.025,
						HalfTime:      2 * time.Minute,
					},
				},
				Prices: []pe.HistoryEntry{
					{
						Price: 15.42,
					},
					{
						Price: 16.56,
					},
					{
						Price: 18.01,
					},
					{
						Price: 17.39,
					},
					{
						Price: 19.65,
					},
					{
						Price: 21.41,
					},
					{
						Price: 20.18,
					},
					{
						Price: 18.45,
					},
					{
						Price: 17.22,
					},
				},
			},
			{
				Beverage: pe.Beverage{
					ID:              "3",
					Name:            "Sort vand",
					Desc:            "Falsk blå vand 🤬",
					ImageSrc:        "/images/vand.jpg",
					LastPriceUpdate: time.Now().Add(-5 * time.Second),
					Params: pe.PricingParams{
						MaxPrice:      50,
						MinPrice:      15,
						BuyMultiplier: 1.025,
						HalfTime:      2 * time.Minute,
					},
				},
				Prices: []pe.HistoryEntry{
					{
						Price: 35.42,
					},
					{
						Price: 30.76,
					},
					{
						Price: 32.54,
					},
					{
						Price: 28.39,
					},
					{
						Price: 29.65,
					},
					{
						Price: 31.41,
					},
					{
						Price: 33.56,
					},
					{
						Price: 30.45,
					},
					{
						Price: 32.33,
					},
				},
			},
			{
				Beverage: pe.Beverage{
					ID:              "4",
					Name:            "Nnguaq",
					Desc:            "En af de bedre drinks i byen",
					ImageSrc:        "/images/vand.jpg",
					LastPriceUpdate: time.Now().Add(-2 * time.Second),
					Params: pe.PricingParams{
						MaxPrice:      50,
						MinPrice:      25,
						BuyMultiplier: 1.025,
						HalfTime:      2 * time.Minute,
					},
				},
				Prices: []pe.HistoryEntry{
					{
						Price: 35.42,
					},
					{
						Price: 30.76,
					},
					{
						Price: 32.54,
					},
					{
						Price: 28.39,
					},
					{
						Price: 29.65,
					},
					{
						Price: 31.41,
					},
					{
						Price: 33.56,
					},
					{
						Price: 30.45,
					},
					{
						Price: 32.33,
					},
				},
			},
		},
	}

	for i, h := range m.histories {
		deductsecs := time.Duration(len(h.Prices)-1) * 10 * time.Second
		at := h.Beverage.LastPriceUpdate.Add(-deductsecs)
		for j := range m.histories[i].Prices {
			m.histories[i].Prices[j].At = at
			at = at.Add(10 * time.Second)
		}

		// Base price is the same as initial price
		m.histories[i].Beverage.Params.BasePrice = h.Prices[len(h.Prices)-1].Price
	}

	return m
}
