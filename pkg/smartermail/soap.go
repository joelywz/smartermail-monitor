package smartermail

import (
	"bytes"
	"encoding/xml"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
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

	client.post("/Services/svcServerAdmin.asmx", NewRequestStatsXml(client.Username, client.Password), &resp)

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

	url := fmt.Sprintf("%s/Services/svcServerAdmin.asmx", client.Host)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))

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
