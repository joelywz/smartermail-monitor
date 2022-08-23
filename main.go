package main

import (
	"embed"
	"log"
	"os"
	"runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

func main() {

	relativeDir := ""

	iv := []byte{117, 198, 35, 158, 66, 75, 117, 93, 86, 48, 127, 177, 51, 93, 249, 50}

	if runtime.GOOS == "darwin" {
		relativeDir = "smartermail-monitor/"
	} else if runtime.GOOS == "windows" {
		relativeDir = ""
	}

	// Create an instance of the app structure
	app := NewApp(relativeDir, iv)

	log.Println(os.Getwd())

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
