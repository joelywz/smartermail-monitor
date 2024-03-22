package auth

import (
	"context"
	"errors"
	"log/slog"

	"github.com/joelywz/smartermail-monitor/pkg/encrypter"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

var ErrVerificationFailed = errors.New("verification failed")

type Service struct {
	repo Repo
}

func NewService(repo Repo) *Service {
	return &Service{
		repo: repo,
	}
}

func (service *Service) Register(ctx context.Context, password string) error {
	slog.Info("Registering authentication challenge")

	r := gonanoid.Must(64)

	val, err := encrypter.Encrypt(r, password)

	if err != nil {
		return err
	}

	err = service.repo.Create(ctx, &Auth{
		ID:             "0",
		ChallengeValue: val,
	})

	if err != nil {
		return err
	}

	slog.Info("Authentication challenge registered successfully")

	return nil
}

func (service *Service) Verify(ctx context.Context, password string) error {
	auth, err := service.repo.Get(ctx, "0")

	if err != nil {
		return err
	}

	_, err = encrypter.Decrypt(auth.ChallengeValue, password)

	if err != nil {
		return errors.Join(err, ErrVerificationFailed)
	}

	return nil
}
