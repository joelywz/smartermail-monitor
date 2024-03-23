package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Smartermail Monitor",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		ErrorFormatter: func(err error) any {

			if uw, ok := err.(interface{ Unwrap() []error }); ok {
				errs := uw.Unwrap()

				e := make([]string, len(errs))

				for i, err := range errs {
					e[i] = err.Error()
				}
				return e
			}

			return []string{err.Error()}
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
