package smartermail

import "encoding/xml"

// Request
type requestEnvelopeXml[T any] struct {
	XMLName xml.Name `xml:"soap:Envelope"`
	Soap    string   `xml:"xmlns:soap,attr"`
	Body    requestBodyXml[T]
}

type requestBodyXml[T any] struct {
	XMLName xml.Name `xml:"soap:Body"`
	Data    T
}

func newSoapRequestBody[T any](body T) *requestEnvelopeXml[T] {
	return &requestEnvelopeXml[T]{
		Soap: "http://schemas.xmlsoap.org/soap/envelope/",
		Body: requestBodyXml[T]{
			Data: body,
		},
	}
}

// Response
type responseEnvelopeXml[T any] struct {
	XMLName xml.Name `xml:"Envelope"`
	Body    responseBodyXml[T]
}

type responseBodyXml[T any] struct {
	XMLName xml.Name `xml:"Body"`
	Data    T
}

type responseResultXml struct {
	Result     string `xml:"Result"`
	ResultCode int    `xml:"ResultCode"`
	Message    string `xml:"Message"`
}

func newSoapResponseBody[T any]() *responseEnvelopeXml[T] {
	return &responseEnvelopeXml[T]{
		Body: responseBodyXml[T]{},
	}
}
