package monitor

import "github.com/joelywz/smartermail-monitor/pkg/smartermail"

type Stats struct {
	ID         string
	Status     Status
	ErrMessage string
	Host       string
	Result     *smartermail.RequestStats
}

type Status string

const (
	StatusOnline   Status = "online"
	StatusOffline  Status = "offline"
	StatusFetching Status = "fetching"
)
