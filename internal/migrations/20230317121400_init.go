package migrations

import (
	"context"

	"github.com/joelywz/smartermail-monitor/internal/auth"
	"github.com/joelywz/smartermail-monitor/internal/monitor"
	"github.com/uptrace/bun"
)

func init() {
	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {

		if _, err := db.NewCreateTable().Model((*auth.Auth)(nil)).Exec(ctx); err != nil {
			return err
		}

		if _, err := db.NewCreateTable().Model((*monitor.Server)(nil)).Exec(ctx); err != nil {
			return err
		}

		return nil
	}, func(ctx context.Context, db *bun.DB) error {

		if _, err := db.NewDropTable().Model((*auth.Auth)(nil)).IfExists().Exec(ctx); err != nil {
			return err
		}

		return nil
	})
}
