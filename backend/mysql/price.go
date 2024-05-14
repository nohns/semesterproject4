package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"slices"
	"strconv"

	pe "github.com/nohns/semesterproject4"
)

type priceStorer struct {
	db *sql.DB
}

func NewPriceStorer(db *sql.DB) *priceStorer {
	return &priceStorer{db: db}
}

const _insertPriceSQL = "INSERT INTO `Prices` (`BeverageId`, `Amount`, `Timestamp`) VALUES (?, ?, ?)"

func (ps *priceStorer) StorePrice(ctx context.Context, u pe.Update) error {
	tx, err := ps.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("tx begin: %v", err)
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, _insertPriceSQL, u.BevID, u.Price, u.At); err != nil {
		return fmt.Errorf("exec insert sql: %v", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("tx commit: %v", err)
	}
	return nil
}

type historyProvider struct {
	db *sql.DB
}

func NewHistoryProvider(db *sql.DB) *historyProvider {
	return &historyProvider{db: db}
}

const (
	_getBeverageSQL       = "SELECT `Name`, `Description`, `ImageSrc`, `MaxPrice`, `MinPrice` FROM `Beverages` WHERE `BeverageId` = ?"
	_getBeveragePricesSQL = "SELECT `Amount`, `Timestamp` FROM `Prices` WHERE `BeverageId` = ? ORDER BY `Timestamp` DESC LIMIT ?"
)

func (hp *historyProvider) History(ctx context.Context, bevID string) (pe.History, error) {
	var h pe.History

	// Get beverage by integer id, and scan the fields into the history struct.
	id, err := strconv.Atoi(bevID)
	if err != nil {
		return h, fmt.Errorf("bevID atoi: %v", err)
	}
	row := hp.db.QueryRowContext(ctx, _getBeverageSQL, id)
	if err := row.Scan(&h.Beverage.Name, &h.Beverage.Desc, &h.Beverage.ImageSrc, &h.Beverage.Params.MaxPrice, &h.Beverage.Params.MinPrice); err != nil {
		return h, fmt.Errorf("query row scan bev: %v", err)
	}
	h.Beverage.ID = bevID // No need to scan id from DB.

	// Get prices related to beverage.
	prices, err := hp.prices(ctx, id)
	if err != nil {
		return h, err
	}
	h.Prices = prices

	return h, nil
}

const (
	_getAllHistoriesSQL = "SELECT `BeverageId`, `Name`, `Description`, `ImageSrc`, `MaxPrice`, `MinPrice` FROM `Beverages` WHERE `BeverageId`"
)

func (hp *historyProvider) Histories(ctx context.Context) ([]pe.History, error) {
	rows, err := hp.db.QueryContext(ctx, _getAllHistoriesSQL)
	if err != nil {
		return nil, fmt.Errorf("query beverages: %v", err)
	}
	hists := make([]pe.History, 0)
	for rows.Next() {
		// Read beverage from query result, and make sure id is converted
		var (
			h  pe.History
			id int
		)
		if err := rows.Scan(&id, &h.Beverage.Name, &h.Beverage.Desc, &h.Beverage.ImageSrc, &h.Beverage.Params.MaxPrice, &h.Beverage.Params.MinPrice); err != nil {
			return nil, fmt.Errorf("scan beverage row: %v", err)
		}
		h.Beverage.ID = strconv.Itoa(id)

		// Get prices related to beverage
		prices, err := hp.prices(ctx, id)
		if err != nil {
			return nil, fmt.Errorf("bev prices: %v", err)
		}
		h.Prices = prices

		hists = append(hists, h)
	}

	return hists, nil
}

// prices gets the prices of beverage with given id from DB. Only get required
// amount of prices.
func (hp *historyProvider) prices(ctx context.Context, numBevID int) ([]pe.HistoryEntry, error) {
	rows, err := hp.db.QueryContext(ctx, _getBeveragePricesSQL, numBevID, pe.HistoryLen)
	if err != nil {
		return nil, fmt.Errorf("query bev prices: %v", err)
	}
	prices := make([]pe.HistoryEntry, 0)
	for rows.Next() {
		var entry pe.HistoryEntry
		if err := rows.Scan(&entry.Price, &entry.At); err != nil {
			return nil, fmt.Errorf("scan price row: %v", err)
		}
		prices = append(prices, entry)
	}
	slices.Reverse(prices) // In a history, oldest price comes first
	return prices, nil
}
