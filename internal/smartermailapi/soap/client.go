package soap

import (
	"encoding/xml"
	"errors"
	"fmt"

	"github.com/joelywz/smartermail-monitor/internal/smartermailapi/entities"
	"github.com/joelywz/smartermail-monitor/internal/smartermailapi/ports"
	"github.com/joelywz/smartermail-monitor/internal/smartermailapi/xmltool"
	"github.com/valyala/fasthttp"
)

var _ ports.Client = &soapClient{}

type soapClient struct {
	Host     string
	Username string
	Password string
}

func NewSOAP(host string, username string, password string) *soapClient {
	return &soapClient{
		Host:     host,
		Username: username,
		Password: password,
	}
}

type getSpoolMessageCount struct {
	XMLName  xml.Name `xml:"http://tempuri.org/ GetSpoolMessageCount"`
	Username string   `xml:"AuthUserName"`
	Password string   `xml:"AuthPassword"`
}

type getSpoolMessageCountResponse struct {
	XMLName xml.Name `xml:"GetSpoolMessageCountResponse"`
	Result  struct {
		XMLName      xml.Name `xml:"GetSpoolMessageCountResult"`
		Success      bool     `xml:"Result"`
		MessageCount int      `xml:"messageCount"`
	}
}

func (c *soapClient) GetSpoolMessagesCount() (*entities.SpoolMessageCount, error) {

	body, err := xmltool.Build(getSpoolMessageCount{
		Username: c.Username,
		Password: c.Password,
	})

	if err != nil {
		return nil, err
	}

	client := fasthttp.Client{}

	req := fasthttp.AcquireRequest()
	req.Header.Set("Content-Type", "application/soap+xml; charset=utf-8")
	req.Header.SetMethod(fasthttp.MethodPost)
	req.SetBody(body)
	req.SetRequestURI(fmt.Sprintf("%s/Services/svcServerAdmin.asmx", c.Host))

	var r fasthttp.Response

	if err := client.Do(req, &r); err != nil {
		return nil, err
	}

	var res getSpoolMessageCountResponse

	if err := xmltool.Parse(r.Body(), &res); err != nil {
		return nil, err
	}

	if !res.Result.Success {
		return nil, errors.New("failed")
	}

	return &entities.SpoolMessageCount{
		Count: res.Result.MessageCount,
	}, err
}
