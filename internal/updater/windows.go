package updater

import (
	"github.com/blang/semver"
	"github.com/rhysd/go-github-selfupdate/selfupdate"
)

func WindowsUpdate(currentVersion semver.Version) error {
	_, err := selfupdate.UpdateSelf(currentVersion, "joelywz/smartermail-monitor")

	if err != nil {
		return err
	}

	return nil
}
