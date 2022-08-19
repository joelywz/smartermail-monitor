package smartermailapi

import (
	"github.com/joelywz/smartermail-monitor/internal/smartermailapi/ports"
	"github.com/joelywz/smartermail-monitor/internal/smartermailapi/soap"
)

func NewSoapClient(host string, username string, password string) ports.Client {
	return soap.NewSOAP(host, username, password)
}
