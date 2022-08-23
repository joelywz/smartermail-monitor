package updater

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

var (
	ErrBadUrl        = errors.New("bad url")
	ErrWriteFile     = errors.New("write error")
	ErrPath          = errors.New("path errror")
	ErrReplaceBinary = errors.New("failed to replace binary")
)

func DarwinUpdate(url string) error {
	homeDir, _ := os.UserHomeDir()
	downloadPath := filepath.Join(homeDir, "Downloads", fmt.Sprintf("smartermail-monitor-update-%s.zip", gonanoid.Must(6)))

	log.Println("downloading from", url, "to", downloadPath)

	err := download(url, downloadPath)

	if err != nil {
		return err
	}

	log.Println("download completed")

	defer os.Remove(downloadPath)

	appPath, err := getDarwinAppPath()

	if err != nil {
		return err
	}

	log.Println("app path: ", appPath)

	err = replaceDarwinApp(downloadPath, appPath)

	if err != nil {
		return err
	}

	return nil
}

func replaceDarwinApp(archivedPath string, appPath string) error {
	cmd := exec.Command("ditto", "-xk", archivedPath, appPath)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr
	err := cmd.Run()
	if err != nil {
		log.Printf("ditto error: %s\n ouput: %s, error: %s", err, out.String(), stderr.String())
		return ErrReplaceBinary
	}
	return nil
}

func getDarwinAppPath() (string, error) {
	appPath, err := os.Executable()

	if err != nil {
		log.Println("failed to get executable path: ", err)
		return "", ErrPath
	}

	appPath = filepath.Join(appPath, "..", "..", "..", "..")
	return appPath, nil
}

func download(url string, path string) error {
	res, err := http.Get(url)

	if err != nil {
		return ErrBadUrl
	}

	out, err := os.Create(path)

	if err != nil {
		return ErrWriteFile
	}

	if _, err := io.Copy(out, res.Body); err != nil {
		return ErrWriteFile
	}

	return nil
}
