package smartermail

import (
	"bytes"
	"context"
	"encoding/xml"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type SoapClient struct {
	Host     string
	Username string
	Password string
	http     http.Client
}

func NewSoapClient(host string, username string, password string) *SoapClient {
	return &SoapClient{
		Host:     host,
		Username: username,
		Password: password,
	}
}

func (client *SoapClient) GetRequestStatus() (*RequestStats, error) {

	resp := newSoapResponseBody[requestStatsResponseXml]()

	err := client.post("/Services/svcServerAdmin.asmx", NewRequestStatsXml(client.Username, client.Password), &resp)

	if err != nil {
		return nil, err
	}

	resultCode := resp.Body.Data.RequestStatusResult.ResultCode

	if resultCode != 0 {
		msg := resp.Body.Data.RequestStatusResult.Message
		return nil, newErrSoapResponse(msg, resultCode)
	}

	result := resp.Body.Data.RequestStatusResult.KeyValuePairs.KeyValues

	var reqStatsRes RequestStats

	for _, s := range result {
		parts := strings.Split(s, "=")

		key := parts[0]
		value := parts[1]

		switch key {
		case "IMAP_IsRunning":
			reqStatsRes.Imap = value == "True"
		case "IMAP_ThreadCount":
			reqStatsRes.ImapThreadCount, _ = strconv.Atoi(value)
		case "POP_IsRunning":
			reqStatsRes.Pop = value == "True"
		case "POP_ThreadCount":
			reqStatsRes.PopThreadCount, _ = strconv.Atoi(value)
		case "Server_Uptime":
			reqStatsRes.Uptime, _ = strconv.ParseInt(value, 10, 64)
		case "SMTP_IsRunning":
			reqStatsRes.Smtp = value == "True"
		case "SMTP_ThreadCount":
			reqStatsRes.SmtpThreadCount, _ = strconv.Atoi(value)
		case "Spool_IsRunning":
			reqStatsRes.Spool = value == "True"
		case "Spool_MessageCount":
			reqStatsRes.SpoolCount, _ = strconv.Atoi(value)
		default:
			slog.Error("Unknown key when parsing response for RequestStatus", "key", key)
		}
	}

	return &reqStatsRes, nil
}

func (client *SoapClient) post(path string, xmlBody any, v any) error {

	body, err := xml.Marshal(xmlBody)

	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	url := fmt.Sprintf("%s%s", client.Host, path)

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))

	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "text/xml")

	resp, err := client.http.Do(req)

	if err != nil {
		return err
	}

	respBody, err := io.ReadAll(resp.Body)

	if err != nil {
		return err
	}

	return xml.Unmarshal(respBody, v)
}
