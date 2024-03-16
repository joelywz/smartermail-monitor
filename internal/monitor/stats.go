package monitor

import "github.com/joelywz/smartermail-monitor/pkg/smartermail"

type Stats struct {
	Online     bool
	ErrMessage string
	Result     *smartermail.RequestStats
}
