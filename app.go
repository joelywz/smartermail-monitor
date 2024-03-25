package main

import (
	"context"
	"log/slog"
	"os"
	"path/filepath"
	"time"

	"github.com/joelywz/smartermail-monitor/internal/auth"
	"github.com/joelywz/smartermail-monitor/internal/db"
	"github.com/joelywz/smartermail-monitor/internal/legacy"
	"github.com/joelywz/smartermail-monitor/internal/monitor"
	"github.com/joelywz/smartermail-monitor/internal/userconf"
	"github.com/joelywz/smartermail-monitor/pkg/smartermail"
	"github.com/joelywz/smartermail-monitor/pkg/updater"
	"github.com/uptrace/bun"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const version = "1.0.0"

// App struct
type App struct {
	ctx            context.Context
	db             *bun.DB
	monitorService *monitor.Service
	updateClient   *updater.Client
	password       string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		updateClient: updater.New(version, "joelywz/smartermail-monitor"),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) SelectDirectory() (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory:     ".",
		Title:                "Select a directory",
		CanCreateDirectories: true,
	})
}

func (a *App) SelectDashboardFile() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory: ".",
		Title:            "Select Dashboard File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Smartermail Monitor",
				Pattern:     "*.smm",
			},
		},
	})
}

func (a *App) SelectLegacyDashboardFile() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory: ".",
		Title:            "Select Legacy Dashboard File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Legacy Smartermail Monitor",
				Pattern:     "*.smmd",
			},
		},
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

	monitorSvc.StatsHook().AddListener(func(stats []*monitor.Stats) {
		slog.Info("Emitting stats")
		runtime.EventsEmit(a.ctx, "stats", stats)
	})

	monitorSvc.RefreshTimeHook().AddListener(func(t time.Time) {
		slog.Info("Emitting refresh time")
		runtime.EventsEmit(a.ctx, "refreshTime", t)
	})

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

func (a *App) AddServer(host string, username string, password string) error {
	return a.monitorService.AddServer(a.ctx, host, username, password)
}

func (a *App) AddServers(servers []monitor.ServerDto) error {
	return a.monitorService.AddServers(a.ctx, servers)
}

func (a *App) DeleteServer(id string) error {
	return a.monitorService.DeleteServer(a.ctx, id)
}

func (a *App) TestConnection(host string, username string, password string) (*smartermail.RequestStats, error) {
	client := smartermail.NewSoapClient(host, username, password)
	return client.GetRequestStatus()
}

func (a *App) Refresh() error {
	if a.monitorService == nil {
		return nil
	}

	a.monitorService.Refresh()
	return nil
}

func (a *App) Update() error {
	return a.updateClient.UpdateLatest()
}

func (a *App) CheckUpdate(force bool) (*updater.CheckUpdateRes, error) {
	return a.updateClient.Check(force)
}

func (a *App) GetCurrentVersion() string {
	return a.updateClient.Version()
}

func (a *App) LoadUserConfig() (*userconf.Config, error) {

	path, err := a.getUserConfigPath()

	if err != nil {
		return nil, err
	}

	slog.Info("Loading user config", "path", path)

	return userconf.Load(path)

}

func (a *App) SaveUserConfig(conf *userconf.Config) error {
	path, err := a.getUserConfigPath()

	if err != nil {
		return err
	}

	slog.Info("Saving user config", "path", path)

	return userconf.Save(conf, path)
}

func (a *App) CreateDatabaseFromLegacy(path string, password string, legacyPath string, legacyPassword string) error {

	slog.Info("Creating database from legacy")
	doc, err := legacy.Read(legacyPath, password)

	if err != nil {
		return err
	}

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

	monitorSvc := monitor.NewService(monitor.NewBunRepo(db), 60*time.Second, monitor.NewSmartermailFetcher(), password)

	defer monitorSvc.Close()

	slog.Info("Importing servers")

	servers := make([]monitor.ServerDto, len(doc.Servers))

	for i, s := range doc.Servers {
		servers[i] = monitor.ServerDto{
			Host:     s.Host,
			Username: s.Username,
			Password: s.Password,
		}
	}

	return monitorSvc.AddServers(a.ctx, servers)
}

func (a *App) VerifyLegacy(path string, password string) (int, error) {
	doc, err := legacy.Read(path, password)

	if err != nil {
		return 0, err
	}

	return len(doc.Servers), nil
}

func (a *App) getUserConfigPath() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(dir, "Smartermail Monitor", "user.json"), nil
}
