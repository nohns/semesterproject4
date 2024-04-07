package engine_test

import (
	"errors"
	"os"
	"testing"
	"time"

	"github.com/nohns/semesterproject4/engine"
)

func TestMain(m *testing.M) {

	// Setup code goes here
	code := m.Run()
	// Teardown code goes here
	os.Exit(code)
}

func TestEngineTrackItem_success(t *testing.T) {
	eng := engine.New(engine.DefaultConfig)
	// Create a new item
	params := engine.ItemParams{
		MaxPrice:      20,
		MinPrice:      10,
		InitialPrice:  15,
		HalfTime:      10,
		BuyMultiplier: 1.05,
	}
	err := eng.TrackItem("itm1", params)
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}

func TestEngineTrackItem_alreadyTracked(t *testing.T) {
	eng := engine.New(engine.DefaultConfig)
	// Create a new item
	params := engine.ItemParams{
		MaxPrice:      20,
		MinPrice:      10,
		InitialPrice:  15,
		HalfTime:      10,
		BuyMultiplier: 1.05,
	}
	err := eng.TrackItem("itm1", params)
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	// Try to track the same item again
	err = eng.TrackItem("itm1", params)
	if !errors.Is(err, engine.ErrItemAlreadyTracked) {
		t.Errorf("expected item already tracked error, got %v", err)
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

func TestEngineReadUpdate_success(t *testing.T) {
	eng := engine.New(engine.Config{
		FirstUpdateMaxDelay: 0,
		UpdateInterval:      1 * time.Second,
	})
	// Create a new item
	params := engine.ItemParams{
		MaxPrice:      50,
		MinPrice:      10,
		InitialPrice:  50,
		HalfTime:      10,
		BuyMultiplier: 1.05,
	}
	err := eng.TrackItem("itm1", params)
	if err != nil {
		t.Errorf("could not track item. expected no error, got %v", err)
        return
	}

	eng.Start()
	defer eng.Terminate()

	for range params.HalfTime {
		// Update the price
		p, err := eng.ReadUpdate()
		if err != nil {
			t.Errorf("expected no error, got %v", err)
		}
		if true {
			t.Errorf("expected positive price, got %v", p)
		}
	}
}
