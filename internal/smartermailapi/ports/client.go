package ports

import "github.com/joelywz/smartermail-monitor/internal/smartermailapi/entities"

type Client interface {
	GetSpoolMessagesCount() (*entities.SpoolMessageCount, error)
}
