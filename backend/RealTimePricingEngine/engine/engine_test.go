package engine_test

import (
	"errors"
	"math"
	"testing"
	"time"

	"github.com/nohns/semesterproject4/engine"
)

var defParams = engine.ItemParams{
	MaxPrice:      20,
	MinPrice:      10,
	InitialPrice:  15,
	HalfTime:      10,
	BuyMultiplier: 1.05,
}

func defEngine(t *testing.T) *engine.Engine {
	eng := engine.New(engine.DefaultConfig)
	err := eng.TrackItem("itm1", defParams)
	if err != nil {
		t.Fatalf("eng track item: expected no error, got %v", err)
	}
	return eng
}

func TestEngineTrackItem_success(t *testing.T) {
	// Just try track a single item
	defEngine(t)
}

func TestEngineTrackItem_alreadyTracked(t *testing.T) {
	eng := defEngine(t)
	// Try to track the same item again
	err := eng.TrackItem("itm1", defParams)
	if !errors.Is(err, engine.ErrItemAlreadyTracked) {
		t.Errorf("expected item already tracked error, got %v", err)
	}
}

func TestEngineUntrackItem_success(t *testing.T) {
	eng := defEngine(t)
	if err := eng.UntrackItem("itm1"); err != nil {
		t.Errorf("could not untrack itm1. expected no error, got %v", err)
		return
	}
}

func TestEngineUntrackItem_notTracked(t *testing.T) {
	eng := defEngine(t)
	err := eng.UntrackItem("itm2")
	if !errors.Is(err, engine.ErrItemNotFound) {
		t.Errorf("expected item not found error")
	}
}

func TestEngineTrackItem_invalidParams(t *testing.T) {
	eng := engine.New(engine.DefaultConfig)
	// Create a new item
	invalidparams := []engine.ItemParams{
		// Make sure that the MaxPrice is greater than or equals to the MinPrice
		{
			MaxPrice:      9,
			MinPrice:      10,
			InitialPrice:  9,
			HalfTime:      10,
			BuyMultiplier: 1.05,
		},
		// Make sure that half time is greater than or equal to 1
		{
			MaxPrice:      20,
			MinPrice:      10,
			InitialPrice:  15,
			HalfTime:      0,
			BuyMultiplier: 1.05,
		},
		// Make sure that the BuyMultiplier is greater than 1
		{
			MaxPrice:      20,
			MinPrice:      10,
			InitialPrice:  15,
			HalfTime:      10,
			BuyMultiplier: 0.95,
		},
		// Make sure that initial price is within the range of MaxPrice and MinPrice
		{
			MaxPrice:      20,
			MinPrice:      10,
			InitialPrice:  50,
			HalfTime:      10,
			BuyMultiplier: 1.05,
		},
	}
	for _, params := range invalidparams {
		err := eng.TrackItem("itm1", params)
		if !errors.Is(err, engine.ErrItemParamsInvalid) {
			t.Errorf("expected invalid params error, got %v", err)
		}
	}
}

func setupReadUpdateEng(t *testing.T, conf engine.Config, params engine.ItemParams) (*engine.Engine, chan engine.PriceUpdate, chan error) {
	eng := engine.New(conf)
	// Create a new item
	err := eng.TrackItem("itm1", params)
	if err != nil {
		t.Errorf("could not track item. expected no error, got %v", err)
		return nil, nil, nil
	}
	if err := eng.Start(); err != nil {
		t.Errorf("could not strart engine. expected no error, got %v", err)
		return nil, nil, nil
	}

	ch := make(chan engine.PriceUpdate)
	errch := make(chan error)
	return eng, ch, errch
}

func readUpdateFromEng(eng *engine.Engine, ch chan<- engine.PriceUpdate, errch chan<- error) {
	p, err := eng.ReadUpdate()
	if err != nil {
		errch <- err
		return
	}
	ch <- p
}

func ensureNoReadUpdateErr(ch <-chan engine.PriceUpdate, errch <-chan error) error {
	select {
	case err := <-errch:
		return err
	default:
		<-ch
		return nil
	}
}

func TestEngineReadUpdate_halftime(t *testing.T) {
	params := engine.ItemParams{
		MaxPrice:      50,
		MinPrice:      0,
		InitialPrice:  50,
		HalfTime:      2, // Value under test
		BuyMultiplier: 1.05,
	}
	eng, ch, errch := setupReadUpdateEng(t, engine.Config{
		FirstUpdateRandomMaxDelay: 0,
		NoisePerThousand:          0,
		UpdateInterval:            2 * time.Second, // Publish an update after the fact
	}, params)
	defer eng.Terminate()

	// Check first price is ok.
	go readUpdateFromEng(eng, ch, errch)
	if err := ensureNoReadUpdateErr(ch, errch); err != nil {
		t.Errorf("could not read first update. expected no error, got %v", err)
		return
	}

	// Get next price
	go readUpdateFromEng(eng, ch, errch)
	select {
	case p := <-ch:
		exp := params.InitialPrice / 2
		expup, expdown := exp*1.02, exp*0.98
		if p.Price > expup {
			t.Errorf("price not halfed after half time. expected %v, got %v", exp, p.Price)
			return
		}
		if p.Price < expdown {
			t.Errorf("price more than halfed after half time. expected %v, got %v", exp, p.Price)
			return
		}
		break
	case err := <-errch:
		t.Errorf("could not read update. expected no error, get %v", err)
		return
	case <-time.After(2500 * time.Millisecond):
		t.Errorf("no update received in time")
		return
	}
}

func TestEngineReadUpdate_notExceedMax(t *testing.T) {
	params := engine.ItemParams{
		MaxPrice:      50, // Value under test
		MinPrice:      0,
		InitialPrice:  49.9,
		HalfTime:      math.MaxInt32,
		BuyMultiplier: math.MaxInt32,
	}
	eng, ch, errch := setupReadUpdateEng(t, engine.Config{
		FirstUpdateRandomMaxDelay: 0,
		NoisePerThousand:          0,
		UpdateInterval:            100 * time.Millisecond, // Publish an update after the fact
	}, params)
	defer eng.Terminate()

	// Check first price is ok.
	go readUpdateFromEng(eng, ch, errch)
	if err := ensureNoReadUpdateErr(ch, errch); err != nil {
		t.Errorf("could not read first update. expected no error, got %v", err)
		return
	}

	// Order a lot of beverage.
	if err := eng.OrderItem("itm1", math.MaxInt32); err != nil {
		t.Errorf("could not order item. expected no error, got %v", err)
		return
	}
	if err := eng.OrderItem("itm1", math.MaxInt32); err != nil {
		t.Errorf("could not order item. expected no error, got %v", err)
		return
	}
	if err := eng.OrderItem("itm1", math.MaxInt32); err != nil {
		t.Errorf("could not order item. expected no error, got %v", err)
		return
	}

	// Get next price
	go readUpdateFromEng(eng, ch, errch)
	select {
	case p := <-ch:
		if p.Price >= params.MaxPrice {
			t.Errorf("price update resulted in price above MaxPrice. expected under %v, got %v", params.MaxPrice, p.Price)
			return
		}
		break
	case err := <-errch:
		t.Errorf("could not read update. expected no error, get %v", err)
		return
	case <-time.After(2500 * time.Millisecond):
		t.Errorf("no update received in time")
		return
	}
}

func TestEngineReadUpdate_buyMultiplier(t *testing.T) {
	params := engine.ItemParams{
		MaxPrice:      150, // Value under test
		MinPrice:      0,
		InitialPrice:  50,
		BuyMultiplier: 2,
		HalfTime:      math.MaxInt,
	}
	eng, ch, errch := setupReadUpdateEng(t, engine.Config{
		FirstUpdateRandomMaxDelay: 0,
		NoisePerThousand:          0,
		UpdateInterval:            100 * time.Millisecond, // Publish an update after the fact
	}, params)
	defer eng.Terminate()

	// Check first price is ok.
	go readUpdateFromEng(eng, ch, errch)
	if err := ensureNoReadUpdateErr(ch, errch); err != nil {
		t.Errorf("could not read first update. expected no error, got %v", err)
		return
	}

	// Order a single beverage.
	if err := eng.OrderItem("itm1", 1); err != nil {
		t.Errorf("could not order item. expected no error, got %v", err)
		return
	}

	// Get next price
	go readUpdateFromEng(eng, ch, errch)
	select {
	case p := <-ch:
		if exp := params.InitialPrice * params.BuyMultiplier * 0.98; p.Price < exp {
			t.Errorf("price was did not rise by buy multipler. expected over %v, got %v", exp, p.Price)
			return
		}
		break
	case err := <-errch:
		t.Errorf("could not read update. expected no error, get %v", err)
		return
	case <-time.After(2500 * time.Millisecond):
		t.Errorf("no update received in time")
		return
	}
}

func TestEngineReadUpdate_startInitialPrice(t *testing.T) {
	params := engine.ItemParams{
		MaxPrice:      150, // Value under test
		MinPrice:      0,
		InitialPrice:  50,
		BuyMultiplier: 1.05,
		HalfTime:      math.MaxInt,
	}
	eng, ch, errch := setupReadUpdateEng(t, engine.Config{
		FirstUpdateRandomMaxDelay: 0,
		NoisePerThousand:          0,
		UpdateInterval:            100 * time.Millisecond, // Publish an update after the fact
	}, params)
	defer eng.Terminate()

	// Get next price
	go readUpdateFromEng(eng, ch, errch)
	select {
	case p := <-ch:
		if exp := params.InitialPrice; p.Price != exp {
			t.Errorf("first price update was not initial price. expected %v, got %v", exp, p.Price)
			return
		}
		break
	case err := <-errch:
		t.Errorf("could not read update. expected no error, get %v", err)
		return
	case <-time.After(2500 * time.Millisecond):
		t.Errorf("no update received in time")
		return
	}
}
