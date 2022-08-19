package xmltool

import (
	"encoding/xml"
)

type envelopeU struct {
	XMLName xml.Name `xml:"Envelope"`
	Body    struct {
		XMLName  xml.Name `xml:"Body"`
		Response string   `xml:",innerxml"`
	}
}

func Parse(d []byte, res interface{}) error {
	var e envelopeU
	err := xml.Unmarshal(d, &e)

	if err != nil {
		return err
	}

	err = xml.Unmarshal([]byte(e.Body.Response), &res)

	return err
}
