package monitor

import (
	"context"

	"github.com/uptrace/bun"
)

var _ ServerRepo = (*BunServerRepo)(nil)

type BunServerRepo struct {
	db *bun.DB
}

func NewBunRepo(db *bun.DB) *BunServerRepo {
	return &BunServerRepo{
		db: db,
	}
}

// Create implements ServerRepo.
func (b *BunServerRepo) Create(ctx context.Context, server *Server) error {

	if _, err := b.db.NewInsert().Model(server).Exec(ctx); err != nil {
		return err
	}

	return nil
}

// Delete implements ServerRepo.
func (b *BunServerRepo) Delete(ctx context.Context, id string) error {

	if _, err := b.db.NewDelete().Model((*Server)(nil)).Where("id = ?", id).Exec(ctx); err != nil {
		return err
	}

	return nil
}

// GetAll implements ServerRepo.
func (b *BunServerRepo) GetAll(ctx context.Context) ([]*Server, error) {

	var servers []*Server

	if err := b.db.NewSelect().Model(&servers).Scan(ctx); err != nil {
		return nil, err
	}

	return servers, nil
}

// Update implements ServerRepo.
func (b *BunServerRepo) Update(ctx context.Context, id string, server *Server) error {

	if _, err := b.db.NewUpdate().Model(server).Where("id = ?", id).Exec(ctx); err != nil {
		return err
	}

	return nil
}

func (b *BunServerRepo) GetByHost(ctx context.Context, host string) (*Server, error) {
	var server Server
	exists, err := b.db.NewSelect().Model(&server).Where("host = ?", host).Exists(ctx)

	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, nil
	}

	return &server, nil
}
