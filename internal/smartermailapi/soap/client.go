package soap

import (
	"encoding/xml"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"

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

type requestStatus struct {
	XMLName  xml.Name `xml:"http://tempuri.org/ RequestStatus"`
	Username string   `xml:"AuthUserName"`
	Password string   `xml:"AuthPassword"`
	ReqStats reqStats `xml:"reqStats"`
}

type reqStats struct {
	XMLName xml.Name `xml:"reqStats"`
	Stats   []string `xml:"string"`
}

type requestStatusResponse struct {
	XMLName xml.Name `xml:"RequestStatusResponse"`
	Result  struct {
		XMLName     xml.Name `xml:"RequestStatusResult"`
		Success     bool     `xml:"Result"`
		KeyValPairs struct {
			XMLName xml.Name `xml:"KeyValuePairs"`
			Stats   []string `xml:"string"`
		}
	}
}

func (c *soapClient) GetRequestStatus() (*entities.Status, error) {
	body, err := xmltool.Build(requestStatus{
		Username: c.Username,
		Password: c.Password,
		ReqStats: reqStats{
			Stats: []string{
				"imap_isrunning",
				"imap_threadcount",
				"pop_isrunning",
				"pop_threadcount",
				"server_uptime",
				"smtp_isrunning",
				"smtp_threadcount",
				"spool_isrunning",
				"spool_messagecount",
				"spool_threadcount",
			},
		},
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

	var res requestStatusResponse

	if err := xmltool.Parse(r.Body(), &res); err != nil {
		return nil, err
	}

	if !res.Result.Success {
		return nil, errors.New("failed")
	}

	for _, item := range res.Result.KeyValPairs.Stats {
		log.Println(item)
	}

	stats := res.Result.KeyValPairs.Stats

	var status entities.Status

	// IMAP
	out := strings.Split(stats[0], "=")

	if len(out) == 2 {
		if out[1] == "True" {
			status.Imap = true
		}
	}

	// Threadcount
	out = strings.Split(stats[1], "=")

	if len(out) == 2 {
		count, err := strconv.Atoi(out[1])

		if err == nil {
			status.ImapThreads = count
		}
	}

	// POP
	out = strings.Split(stats[2], "=")

	if len(out) == 2 {
		if out[1] == "True" {
			status.Pop = true
		}
	}

	// Pop Threadcount
	out = strings.Split(stats[3], "=")

	if len(out) == 2 {
		count, err := strconv.Atoi(out[1])

		if err == nil {
			status.PopThreads = count
		}
	}

	// Uptime
	out = strings.Split(stats[4], "=")

	if len(out) == 2 {
		uptime, err := strconv.Atoi(out[1])

		if err == nil {
			status.Uptime = uptime
		}
	}

	// SMTP
	out = strings.Split(stats[5], "=")

	if len(out) == 2 {
		if out[1] == "True" {
			status.Smtp = true
		}
	}

	// SMTP Threadcount
	out = strings.Split(stats[6], "=")

	if len(out) == 2 {
		count, err := strconv.Atoi(out[1])

		if err == nil {
			status.SmtpThreads = count
		}
	}

	// Spool
	out = strings.Split(stats[7], "=")

	if len(out) == 2 {
		if out[1] == "True" {
			status.Spool = true
		}
	}

	// Spool Count
	out = strings.Split(stats[8], "=")

	if len(out) == 2 {
		count, err := strconv.Atoi(out[1])

		if err == nil {
			status.SpoolCount = count
		}
	}

	// Spool Threadcount
	out = strings.Split(stats[9], "=")

	if len(out) == 2 {
		count, err := strconv.Atoi(out[1])

		if err == nil {
			status.SpoolThreads = count
		}
	}

	return &status, nil
}
