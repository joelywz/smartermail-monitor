package main

import (
	"context"
	"fmt"

	"github.com/joelywz/smartermail-monitor/internal/smartermailapi"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetSpoolMessageCount(host string, username string, password string) int {
	client := smartermailapi.NewSoapClient(host, username, password)

	res, err := client.GetSpoolMessagesCount()
	if err != nil {
		return -1
	}

	return res.Count

}
