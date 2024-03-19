package main

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/joelywz/smartermail-monitor/internal/auth"
	"github.com/joelywz/smartermail-monitor/internal/db"
	"github.com/joelywz/smartermail-monitor/internal/monitor"
	"github.com/uptrace/bun"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx            context.Context
	db             *bun.DB
	monitorService *monitor.Service
	password       string
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

func (a *App) SelectDirectory() (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory:     ".",
		Title:                "Select a directory",
		CanCreateDirectories: true,
	})
}

func (a *App) CreateDatabase(path string, password string) error {
	if err := db.Create(a.ctx, path); err != nil {
		return err
	}

	db, err := db.Open(path)

	if err != nil {
		return err
	}

	defer db.Close()

	authRepo := auth.NewBunRepo(db)
	authService := auth.NewService(authRepo)

	if err := authService.Register(a.ctx, password); err != nil {
		return err
	}

	return nil
}

func (a *App) Load(path string, password string) error {
	slog.Info("Loading dashboard", "path", path)

	a.Unload()

	db, err := db.Open(path)

	if err != nil {
		return err
	}

	slog.Info("Verifying dashboard", "path", path)

	authSvc := auth.NewService(auth.NewBunRepo(db))

	if err := authSvc.Verify(a.ctx, password); err != nil {
		db.Close()
		return err
	}

	monitorSvc := monitor.NewService(monitor.NewBunRepo(db), 60*time.Second, monitor.NewSmartermailFetcher(), password)

	if err := monitorSvc.Init(); err != nil {
		monitorSvc.Close()
		return err
	}

	slog.Info("Loaded dashboard")

	a.db = db
	a.monitorService = monitorSvc
	a.password = password

	runtime.EventsEmit(a.ctx, "loaded", LoadedEvent{
		Path: path,
	})

	return nil

}

func (a *App) Unload() {
	if a.db == nil {
		return
	}

	slog.Info("Unloading dashboard")

	if a.monitorService != nil {
		a.monitorService.Close()
		a.monitorService = nil
	}

	if a.db != nil {
		a.db.DB.Close()
		a.db.Close()
		a.db = nil
	}

	runtime.EventsEmit(a.ctx, "unloaded", nil)

}
