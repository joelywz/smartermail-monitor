package monitor

import (
	"context"

	"github.com/joelywz/smartermail-monitor/pkg/smartermail"
)

var _ Fetcher = (*SmartermailFetcher)(nil)

type SmartermailFetcher struct {
}

func NewSmartermailFetcher() *SmartermailFetcher {
	return &SmartermailFetcher{}
}

// Fetch implements Fetcher.
func (s *SmartermailFetcher) Fetch(ctx context.Context, host string, username string, password string) (*smartermail.RequestStats, error) {
	client := smartermail.NewSoapClient(host, username, password)
	return client.GetRequestStatus()
}
