package pe

import "time"

type Beverage struct {
	ID              string        `json:"beverageId"`
	Name            string        `json:"name"`
	Desc            string        `json:"description"`
	ImageSrc        string        `json:"imageSrc"`
	IsActive        bool          `json:"isActive"`
	LastPriceUpdate time.Time     `json:"lastUpdate"`
	Params          PricingParams `json:"-"`
}

type PricingParams struct {
	MaxPrice      float64
	MinPrice      float64
	BasePrice     float64
	BuyMultiplier float64
	HalfTime      time.Duration
}
