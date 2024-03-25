package userconf

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type Config struct {
	LastAccessedFile string `json:"lastAccessedFile"`
}

func NewDefaultConfig() *Config {
	return &Config{
		LastAccessedFile: "",
	}
}

func Load(path string) (*Config, error) {

	_, err := os.Stat(path)

	if os.IsNotExist(err) {

		conf := NewDefaultConfig()

		if err := Save(conf, path); err != nil {
			return nil, err
		}

		return conf, nil
	} else if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(path)

	if err != nil {
		return nil, err
	}

	var conf Config

	if err := json.Unmarshal(data, &conf); err != nil {
		return nil, err
	}

	return &conf, nil
}

func Save(conf *Config, path string) error {

	data, err := json.Marshal(conf)

	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return err
	}

	if err := os.WriteFile(path, data, 0644); err != nil {
		return err
	}

	return nil
}
