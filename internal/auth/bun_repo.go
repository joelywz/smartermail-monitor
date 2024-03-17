package auth

import (
	"context"

	"github.com/uptrace/bun"
)

var _ Repo = (*BunRepo)(nil)

type BunRepo struct {
	db *bun.DB
}

func NewBunRepo(db *bun.DB) *BunRepo {
	return &BunRepo{db: db}
}

// Create implements Repo.
func (repo *BunRepo) Create(ctx context.Context, auth *Auth) error {
	if _, err := repo.db.NewInsert().Model(auth).Exec(ctx); err != nil {
		return err
	}

	return nil
}

// Get implements Repo.
func (repo *BunRepo) Get(ctx context.Context, id string) (*Auth, error) {

	var auth Auth

	if err := repo.db.NewSelect().Model(&auth).Where("id = ?", id).Scan(ctx); err != nil {
		return nil, err
	}

	return &auth, nil
}
