package xmltool

import "encoding/xml"

type envelope struct {
	XMLName xml.Name `xml:"soap12:Envelope"`
	Soap    string   `xml:"xmlns:soap12,attr"`
	Xsi     string   `xml:"xmlns:xsi,attr"`
	Xsd     string   `xml:"xmlns:xsd,attr"`
	Body    body     `xml:"soap12:Body"`
}

type body struct {
	XMLName xml.Name `xml:"soap12:Body"`
	Data    interface{}
}

func Build(data interface{}) ([]byte, error) {
	return xml.Marshal(envelope{
		Soap: "http://www.w3.org/2003/05/soap-envelope",
		Xsi:  "http://www.w3.org/2001/XMLSchema-instance",
		Xsd:  "http://www.w3.org/2001/XMLSchema",
		Body: body{
			Data: data,
		},
	})
}
