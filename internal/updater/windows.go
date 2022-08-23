package updater

import (
	"os"

	"github.com/rhysd/go-github-selfupdate/selfupdate"
)

func WindowsUpdate(url string) error {

	cmdPath, _ := os.Executable()

	err := selfupdate.UpdateTo(url, cmdPath)

	if err != nil {
		return err
	}

	return nil
}
