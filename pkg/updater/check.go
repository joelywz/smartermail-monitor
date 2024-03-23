package updater

import (
	"errors"
	"os"
	"runtime"
	"time"

	"github.com/blang/semver"
	"github.com/rhysd/go-github-selfupdate/selfupdate"
)

type CheckUpdateRes struct {
	Name         string     `json:"name"`
	Version      string     `json:"version"`
	PublishedAt  *time.Time `json:"publishedAt"`
	ReleaseNotes string     `json:"releaseNotes"`
	RepoName     string     `json:"repoName"`
	Latest       bool       `json:"latest"`
}

type Client struct {
	repo    string
	version string
	release *selfupdate.Release
}

func New(version string, repo string) *Client {
	return &Client{
		repo:    repo,
		version: version,
		release: nil,
	}
}

func (c *Client) Check() (*CheckUpdateRes, error) {
	release, found, err := selfupdate.DetectLatest(c.repo)

	if err != nil {
		return nil, err
	}

	v := semver.MustParse(c.version)

	if !found {
		return nil, errors.New("no release found")
	}

	c.release = release

	return &CheckUpdateRes{
		Name:         release.Name,
		Version:      release.Version.String(),
		PublishedAt:  release.PublishedAt,
		ReleaseNotes: release.ReleaseNotes,
		RepoName:     release.RepoName,
		Latest:       release.Version.LTE(v),
	}, nil
}

func (c *Client) UpdateLatest() error {

	if c.release == nil {
		if _, err := c.Check(); err != nil {
			return err
		}
	}

	if runtime.GOOS == "darwin" {
		return DarwinUpdate(c.release)
	}

	cmdPath, _ := os.Executable()

	return selfupdate.UpdateTo(c.release.AssetURL, cmdPath)

}

func (c *Client) Version() string {
	return c.version
}
