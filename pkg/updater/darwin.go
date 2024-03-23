package updater

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/rhysd/go-github-selfupdate/selfupdate"
	"golang.org/x/exp/slog"
)

var (
	ErrBadUrl         = errors.New("bad url")
	ErrWritefile      = errors.New("error writing file")
	ErrPath           = errors.New("error getting path")
	ErrReplaceBinary  = errors.New("error replacing binary")
	ErrInvalidPackage = errors.New("the package is invalid, expected /Contents/Macos/{binary}")
)

func DarwinUpdate(release *selfupdate.Release) error {
	tempDir := os.TempDir()
	tempAppDir := filepath.Join(tempDir, fmt.Sprintf("%s-%d", "updater", release.AssetID))
	os.MkdirAll(tempAppDir, 0755)

	downloadPath := filepath.Join(tempAppDir, fmt.Sprintf("%d.zip", release.AssetID))

	if err := downloadToPath(release.AssetURL, downloadPath); err != nil {
		return err
	}

	defer os.RemoveAll(tempAppDir)

	appPath, err := darwinAppPath()

	if err != nil {
		return err
	}

	return darwinReplaceApp(downloadPath, appPath)
}

func darwinReplaceApp(archivedPath string, appPath string) error {
	cmd := exec.Command("ditto", "-xk", archivedPath, appPath)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr
	err := cmd.Run()
	if err != nil {
		slog.Error("ditto error: %s\n ouput: %s, error: %s", "err", err, "out", out.String(), "stderr", stderr.String())
		return errors.Join(err, ErrReplaceBinary)
	}
	return nil
}

func darwinAppPath() (string, error) {
	appPath, err := os.Executable()

	if err != nil {
		return "", errors.Join(err, ErrPath)
	}

	if filepath.Base(appPath) != "MacOS" {
		return "", ErrInvalidPackage
	}

	if filepath.Base(filepath.Dir(appPath)) != "Contents" {
		return "", ErrInvalidPackage
	}

	appPath = filepath.Join(appPath, "..", "..", "..", "..")
	return appPath, nil
}

func downloadToPath(url string, path string) error {
	res, err := http.Get(url)

	if err != nil {
		return ErrBadUrl
	}

	out, err := os.Create(path)

	if err != nil {
		return errors.Join(err, ErrWritefile)
	}

	if _, err := io.Copy(out, res.Body); err != nil {
		return errors.Join(err, ErrWritefile)
	}

	return nil
}
