package engine

import (
	"math"
	"math/rand"
	"time"
)

type item struct {
	params    ItemParams
	initprice float64
	decaycoef float64
	lastorder time.Time
}

func newItem(params ItemParams) item {
	return item{
		params:    params,
		initprice: params.InitialPrice,
		decaycoef: toDecayCoefficient(params.HalfTime),
		lastorder: time.Now(),
	}
}

func (i *item) reset() {
	i.lastorder = time.Now()
}

func (i *item) order(qty int) {
	mult := math.Pow(i.params.BuyMultiplier, float64(qty))
	// Random noise for price change
	noise := float64(rand.Intn(25)) - 12.5
	noise = 1 + float64(noise)/1000
	mult *= noise

	currprice := i.price()

	// Cap price increase to 70% of remaining multiplier to max
	maxmult := (i.params.MaxPrice / currprice)
	maxmult = 1 + (maxmult-1)*0.7
	mult = min(mult, maxmult)

	// fmt.Printf("price before: %.2f, price now: %.2f, (noise = %.3f, mult = %.3f)\n", i.price(), i.price()*mult, noise, mult)
	i.initprice = currprice * mult
	i.reset()
}

func (i *item) price() float64 {
	x := time.Now().Sub(i.lastorder) / time.Second
	if x == 0 {
		return i.initprice
	}
	// log decaycoef
	b := i.initprice - i.params.MinPrice
	return i.params.MinPrice + b*math.Pow(math.E, i.decaycoef*float64(x))
}

func (i *item) tweakParams(params ItemParams) {
	// Clamp current price between min and max to stay in bounds
	i.initprice = params.InitialPrice
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
