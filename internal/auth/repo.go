package auth

import "context"

type Repo interface {
	Create(ctx context.Context, auth *Auth) error
	Get(ctx context.Context, id string) (*Auth, error)
}
