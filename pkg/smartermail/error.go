package smartermail

import "fmt"

type ErrSoapResponse struct {
	Message string
	Code    int
}

func (e *ErrSoapResponse) Error() string {
	return fmt.Sprintf("Soap response error: %s (code: %d)", e.Message, e.Code)
}

func newErrSoapResponse(msg string, code int) *ErrSoapResponse {
	return &ErrSoapResponse{
		Message: msg,
		Code:    code,
	}

}
