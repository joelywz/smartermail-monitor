package monitor

import "github.com/uptrace/bun"

type Server struct {
	bun.BaseModel `bun:"table:servers"`
	ID            string `bun:"id,pk"`
	Host          string `bun:"host,notnull,unique"`
	Username      string `bun:"username,notnull"`
	Password      string `bun:"password,notnull"`
}
