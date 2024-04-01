package engine

import (
	"math"
	"time"
)

type item struct {
	params    ItemParams
	initprice float64
	decaycoef float64
	lastorder time.Time
}

func newItem(params ItemParams) item {
	decaycoef := toDecayCoefficient(params.HalfTime)

	return item{
		params:    params,
		initprice: params.InitialPrice,
		decaycoef: decaycoef,
		lastorder: time.Now(),
	}
}

func (i *item) reset() {
	i.lastorder = time.Now()
}

func (i *item) order(qty int) {
	mult := i.params.BuyMultiplier * float64(qty)
	i.initprice = i.price() * mult
	i.reset()
}

func (i *item) price() float64 {
	x := time.Now().Sub(i.lastorder) / time.Second
	b := i.initprice - i.params.MinPrice

	return i.params.MinPrice + b*math.Pow(i.decaycoef, float64(x))
}

func (i *item) tweakParams(params ItemParams) {
	// Clamp current price between min and max to stay in bounds
	i.initprice = clampPrice(params, i.price())
	i.decaycoef = toDecayCoefficient(params.HalfTime)
	i.reset()

	i.params = params
}

func toDecayCoefficient(halftime int) float64 {
	return (-math.Ln2) / float64(halftime)
}

// clampPrice takes the half-time of an item and the current price, and returns a
// new price that is guarenteed to be within bounds. The bounds are padded such that
// a valid exponential decay formula can be derrived.
func clampPrice(params ItemParams, price float64) float64 {
	maxp := params.MaxPrice * params.BuyMultiplier
	minp := params.MinPrice * negativeMultiplier(params.BuyMultiplier)
	return min(max(price, minp), maxp)
}

func negativeMultiplier(m float64) float64 {
	return 1 - (m - 1)
}
