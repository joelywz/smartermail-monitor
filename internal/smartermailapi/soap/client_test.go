package soap_test

import (
	"testing"

	"github.com/joelywz/smartermail-monitor/internal/smartermailapi"
)

func TestRequestStatus(t *testing.T) {

	client := smartermailapi.NewSoapClient("http://103.215.137.72", "admin", "ja2628*.$$")

	client.GetRequestStatus()

}
