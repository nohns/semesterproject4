package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"strconv"

	pe "github.com/nohns/semesterproject4"
)

type bevRepo struct {
	db *sql.DB
}

const (
	_getBeverageByIDSQL = "SELECT `Name`, `Description`, `ImageSrc`, `MaxPrice`, `MinPrice` FROM `Beverages` WHERE `BeverageId` = ?"
	_getAllBeveragesSQL = "SELECT `BeverageId`, `Name`, `Description`, `ImageSrc`, `MaxPrice`, `MinPrice` FROM `Beverages` WHERE `BeverageId`"
)

func (br *bevRepo) FindBeverages(ctx context.Context) ([]pe.Beverage, error) {
	rows, err := br.db.QueryContext(ctx, _getAllBeveragesSQL)
	if err != nil {
		return nil, fmt.Errorf("query beverages: %v", err)
	}
	defer rows.Close()
	bevs := make([]pe.Beverage, 0)
	for rows.Next() {
		// Read beverage from query result, and make sure id is converted
		var (
			b  pe.Beverage
			id int
		)
		if err := rows.Scan(&id, &b.Name, &b.Desc, &b.ImageSrc, &b.Params.MaxPrice, &b.Params.MinPrice); err != nil {
			return nil, fmt.Errorf("scan beverage row: %v", err)
		}
		b.ID = strconv.Itoa(id)
		bevs = append(bevs, b)
	}
	return bevs, nil
}

func (br *bevRepo) BeverageByID(ctx context.Context, bevID string) (pe.Beverage, error) {
	var b pe.Beverage
	id, err := strconv.Atoi(bevID)
	if err != nil {
		return b, fmt.Errorf("bevID atoi: %v", err)
	}
	row := br.db.QueryRowContext(ctx, _getBeverageByIDSQL, id)
	if err := row.Scan(&b.Name, &b.Desc, &b.ImageSrc, &b.Params.MaxPrice, &b.Params.MinPrice); err != nil {
		return b, fmt.Errorf("query row scan bev: %v", err)
	}
	b.ID = bevID // No need to scan id from DB.
	return b, nil
}
