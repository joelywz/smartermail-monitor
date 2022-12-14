package main

import (
	"embed"
	"fmt"
	"os"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

const VERSION = "0.3.1"

func main() {

	// Create an instance of the app structure
	app := NewApp(getBaseDir(), getIv(), VERSION, runtime.GOOS)

	// doSelfUpdate()
	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Smartermail Monitor",
		Width:            700,
		Height:           600,
		MinHeight:        600,
		MinWidth:         700,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 245, G: 245, B: 245, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

func getBaseDir() string {
	baseDir := ""
	if runtime.GOOS == "darwin" {
		homeDir, _ := os.UserHomeDir()
		baseDir = fmt.Sprintf("%s/Library/SmartermailMonitorData/", homeDir)
	} else if runtime.GOOS == "windows" {
		baseDir = ""
	}
	return baseDir
}

func getIv() []byte {
	return []byte{117, 198, 35, 158, 66, 75, 117, 93, 86, 48, 127, 177, 51, 93, 249, 50}
}
