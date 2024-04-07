package mock

import (
	"time"

	pe "github.com/nohns/semesterproject4"
)

type mockData struct {
	bevs []bevItem
    histories []pe.History
}

type bevItem struct {
	id        string
	b         pe.Beverage
	h         pe.History
}

var Data = mockData{
	histories: []pe.History{
		{
			Beverage: pe.Beverage{
				ID:       "1",
				Name:     "Blå vand",
				Desc:     "Den er rimelig fucking blå og så er der vand i",
				ImageSrc: "/images/vand.jpg",
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
				ID:       "2",
				Name:     "Ceres Top",
				Desc:     "Fin aarhus øl ja tak",
				ImageSrc: "/images/bajselademad.jpg",
				Params: pe.PricingParams{
					MaxPrice:      25,
					MinPrice:      10,
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
				ID:       "3",
				Name:     "Sort vand",
				Desc:     "Falsk blå vand 🤬",
				ImageSrc: "/images/vand.jpg",
				Params: pe.PricingParams{
					MaxPrice:      25,
					MinPrice:      10,
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
				ID:       "4",
				Name:     "Nnguaq",
				Desc:     "En af de bedre drinks i byen",
				ImageSrc: "/images/vand.jpg",
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
