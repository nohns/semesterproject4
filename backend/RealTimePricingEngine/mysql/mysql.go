package mysql

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func Open(connstr string) (*sql.DB, error) {
	fmt.Printf("conn str: %v\n", connstr)
	db, err := sql.Open("mysql", connstr)
	if err != nil {
		return nil, err
	}

	// Important settings of MySQL go driver. See
	// https://github.com/go-sql-driver/mysql.
	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	return db, nil
}
