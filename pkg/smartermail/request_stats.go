package smartermail

import "encoding/xml"

type RequestStats struct {
	Imap            bool
	ImapThreadCount int
	Pop             bool
	PopThreadCount  int
	Uptime          int64
	Smtp            bool
	SmtpThreadCount int
	Spool           bool
	SpoolCount      int
}

// XML Request
type requestStatsXml struct {
	XMLName            xml.Name `xml:"RequestStatus"`
	Xmlns              string   `xml:"xmlns,attr"`
	AuthUserName       string
	AuthPassword       string
	RequestStatKeysXml requestStatsKeysXml
}

func NewRequestStatsXml(username string, password string) *requestEnvelopeXml[requestStatsXml] {
	return newSoapRequestBody(requestStatsXml{
		Xmlns:        "http://tempuri.org/",
		AuthUserName: username,
		AuthPassword: password,
		RequestStatKeysXml: requestStatsKeysXml{
			Keys: []string{
				"imap_isrunning",
				"imap_threadcount",
				"pop_isrunning",
				"pop_threadcount",
				"server_uptime",
				"smtp_isrunning",
				"smtp_threadcount",
				"spool_isrunning",
				"spool_messagecount",
			},
		},
	},
	)
}

type requestStatsKeysXml struct {
	XMLName xml.Name `xml:"reqStats"`
	Keys    []string `xml:"string"`
}

// XML Response
type requestStatsResponseXml struct {
	XMLName             xml.Name `xml:"RequestStatusResponse"`
	RequestStatusResult struct {
		responseResultXml
		KeyValuePairs struct {
			KeyValues []string `xml:"string"`
		}
	}
}
