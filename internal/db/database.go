package db

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/joelywz/smartermail-monitor/internal/migrations"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/sqlitedialect"
	"github.com/uptrace/bun/driver/sqliteshim"
	"github.com/uptrace/bun/migrate"
)

func Create(ctx context.Context, path string) error {
	slog.Info("Creating database", "path", path)
	sqldb, err := sql.Open(sqliteshim.ShimName, fmt.Sprintf("file:%s?cache=shared", path))

	if err != nil {
		return err
	}

	defer sqldb.Close()

	// _, err = sqldb.Exec("PRAGMA journal_mode=WAL;")
	// if err != nil {
	// 	return err
	// }

	db := bun.NewDB(sqldb, sqlitedialect.New())

	migrator := migrate.NewMigrator(db, migrations.Migrations)

	slog.Info("Initializing migrations")

	if err := migrator.Init(ctx); err != nil {
		return err
	}

	slog.Info("Migrating database")

	if _, err := migrator.Migrate(ctx); err != nil {
		return err
	}

	slog.Info("Migration completed")

	return nil
}

func Open(path string) (*bun.DB, error) {
	slog.Info("Opening database", "path", path)
	sqldb, err := sql.Open(sqliteshim.ShimName, fmt.Sprintf("file:%s?cache=shared", path))

	if err != nil {
		return nil, err
	}

	db := bun.NewDB(sqldb, sqlitedialect.New())

	return db, nil
}
