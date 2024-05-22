package app

import (
	"fmt"
	"log/slog"
	"os"
)

type config struct {
	httpaddr  string
	trigaddr  string
	dbconnstr string
	loglvl    slog.Level
	mocked    bool
}

func (c *config) mustValidate() {
	if c.httpaddr == "" {
		panic("conf: http port not given")
	}
	if c.trigaddr == "" {
		panic("conf: trigger port not given")
	}
	if c.dbconnstr == "" {
		panic("conf: all db vars not given")
	}
}

func readConf() config {
	c := config{}
	if p := os.Getenv("HTTP_PORT"); p != "" {
		c.httpaddr = fmt.Sprintf(":%s", p)
	}
	if p := os.Getenv("TRIGGER_PORT"); p != "" {
		c.trigaddr = fmt.Sprintf(":%s", p)
	}
	var (
		dbuser   = os.Getenv("DB_USERNAME")
		dbpass   = os.Getenv("DB_PASSWORD")
		dbserver = os.Getenv("DB_SERVER")
		dbname   = os.Getenv("DB_NAME")
	)
	if dbuser != "" && dbpass != "" && dbserver != "" && dbname != "" {
		c.dbconnstr = mysqlConnStr(dbuser, dbpass, dbserver, dbname)
	}
	switch os.Getenv("LOG_LEVEL") {
	case "DEBUG":
		c.loglvl = slog.LevelDebug
	}
	if m := os.Getenv("RUN_MOCKED"); m == "1" {
		c.mocked = true
	}

	c.mustValidate()
	return c
}

func mysqlConnStr(user, pass, server, dbname string) string {
	return fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", user, pass, server, dbname)
}
