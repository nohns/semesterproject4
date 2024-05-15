package app

import (
	"fmt"
	"os"
)

type config struct {
	httpaddr  string
	trigaddr  string
	dbconnstr string
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
	var c config
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

	c.mustValidate()
	return c
}

func mysqlConnStr(user, pass, server, dbname string) string {
	return fmt.Sprintf("mysql://%s:%s@%s/%s?parseDate=true", user, pass, server, dbname)
}
