package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/blang/semver"
	"github.com/joelywz/smartermail-monitor/internal/keep"
	"github.com/joelywz/smartermail-monitor/internal/smartermailapi"
	"github.com/joelywz/smartermail-monitor/internal/updater"
	"github.com/rhysd/go-github-selfupdate/selfupdate"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var DATA_FILENAME = "data.smmd"

type Status struct {
	Imap         bool `json:"imap"`
	ImapThreads  int  `json:"imapThreads"`
	Pop          bool `json:"pop"`
	PopThreads   int  `json:"popThreads"`
	Uptime       int  `json:"uptime"`
	Smtp         bool `json:"smtp"`
	SmtpThreads  int  `json:"smtpThreads"`
	Spool        bool `json:"spool"`
	SpoolCount   int  `json:"spoolCount"`
	SpoolThreads int  `json:"spoolThreads"`
}

// App struct
type App struct {
	iv          []byte
	relativeDir string
	version     string
	ctx         context.Context
	os          string
}

// NewApp creates a new App application struct
func NewApp(relDir string, iv []byte, version string, os string) *App {
	return &App{
		iv:          iv,
		relativeDir: relDir,
		version:     version,
		os:          os,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.createDir()
	a.ctx = ctx
	a.CheckForUpdates(true)
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

func (a *App) GetStatus(host string, username string, password string) (*Status, error) {
	client := smartermailapi.NewSoapClient(host, username, password)

	res, err := client.GetRequestStatus()
	if err != nil {
		return nil, err
	}

	return &Status{
		Imap:         res.Imap,
		ImapThreads:  res.ImapThreads,
		Pop:          res.Pop,
		PopThreads:   res.PopThreads,
		Uptime:       res.Uptime,
		Smtp:         res.Smtp,
		SmtpThreads:  res.SmtpThreads,
		Spool:        res.Spool,
		SpoolCount:   res.SpoolCount,
		SpoolThreads: res.SpoolThreads,
	}, nil
}

func (a *App) HasSavedData() bool {
	if _, err := os.Stat(a.getPath(DATA_FILENAME)); err == nil {
		return true
	} else {
		return false
	}
}

func (a *App) SaveData(data string, password string) bool {
	a.createDir()
	f, err := os.Create(a.getPath(DATA_FILENAME))

	if err != nil {
		log.Println(err)
		return false
	}

	hashed := keep.Hash(password)
	b := keep.Encrypt([]byte(data), hashed, a.iv)

	if _, err := f.Write(b); err != nil {
		log.Println(err)
		return false
	}

	f.Close()

	return true
}

func (a *App) ReadData(password string) string {

	b, err := os.ReadFile(a.getPath(DATA_FILENAME))

	if err != nil {
		log.Println(err)
		return ""
	}

	hashed := keep.Hash(password)
	data := keep.Decrypt(b, hashed, a.iv)

	return string(data)
}

func (a *App) DeleteData() (bool, error) {
	err := os.Remove(a.getPath((DATA_FILENAME)))

	if err != nil {
		return false, err
	}

	return true, nil
}

func (a *App) getPath(path string) string {
	return fmt.Sprintf("%s%s", a.relativeDir, path)
}

func (a App) createDir() error {
	if a.relativeDir == "" {
		return nil
	}

	if err := os.MkdirAll(a.relativeDir, 0770); err != nil {
		return err
	}

	return nil
}

func (a *App) CheckForUpdates(silent bool) (string, error) {
	release, found, err := selfupdate.DetectLatest("joelywz/smartermail-monitor")

	if err != nil {
		log.Println(err)
	}

	v := semver.MustParse(a.version)
	if !found || release.Version.LTE(v) {
		if !silent {
			runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
				Type:          runtime.InfoDialog,
				Title:         "No Updates Available",
				Message:       "Current version: " + a.version,
				Buttons:       []string{"OK"},
				DefaultButton: "OK",
			})
		}

		return "no updates", nil
	}

	message := "Version " + release.Version.String() + " is available\n\n Release notes:\n" + release.ReleaseNotes

	opts := runtime.MessageDialogOptions{
		Type:          runtime.QuestionDialog,
		Title:         "Update Available",
		Message:       message,
		Buttons:       []string{"Update", "Cancel"},
		DefaultButton: "Update",
		CancelButton:  "Cancel",
	}

	dialog, _ := runtime.MessageDialog(a.ctx, opts)

	if dialog == "Update" || dialog == "Yes" {
		if a.os == "darwin" {
			err = updater.DarwinUpdate(release.AssetURL)
		} else {
			log.Println("updating to ", release.Version)
			err = updater.WindowsUpdate(release.AssetURL)
		}

		if err == nil {
			runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
				Type:          runtime.InfoDialog,
				Title:         "Update Completed",
				Message:       "Update " + release.Version.String() + " is installed. Please restart the application to apply changes.",
				Buttons:       []string{"OK"},
				DefaultButton: "OK",
			})
		} else {
			runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
				Type:          runtime.InfoDialog,
				Title:         "Update Failed",
				Message:       "Try downloading and updating the application manually.",
				Buttons:       []string{"OK"},
				DefaultButton: "OK",
			})
		}
	}

	return "success", nil
}
