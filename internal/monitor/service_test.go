package monitor_test

import (
	"context"
	"testing"
	"time"

	"github.com/joelywz/smartermail-monitor/internal/monitor"
)

var _ monitor.ServerRepo = (*MemRepo)(nil)

type MemRepo struct {
	servers map[string]*monitor.Server
}

func NewMemRepo() *MemRepo {
	return &MemRepo{
		servers: make(map[string]*monitor.Server),
	}
}

// Create implements monitor.ServerRepo.
func (repo *MemRepo) Create(ctx context.Context, server *monitor.Server) error {
	repo.servers[server.ID] = server
	return nil
}

// Delete implements monitor.ServerRepo.
func (repo *MemRepo) Delete(ctx context.Context, id string) error {
	delete(repo.servers, id)
	return nil
}

// GetAll implements monitor.ServerRepo.
func (repo *MemRepo) GetAll(ctx context.Context) ([]*monitor.Server, error) {

	s := make([]*monitor.Server, len(repo.servers))
	i := 0
	for _, v := range repo.servers {
		s[i] = v
		i++
	}

	return s, nil

}

// Update implements monitor.ServerRepo.
func (repo *MemRepo) Update(ctx context.Context, id string, server *monitor.Server) error {
	repo.servers[id] = server
	return nil
}

func TestService(t *testing.T) {
	service := monitor.NewService(NewMemRepo(), time.Second*30)

	service.AddServer(context.Background(), "localhost", "admin", "admin")
	service.AddServer(context.Background(), "localhost2", "admin", "admin")
	service.AddServer(context.Background(), "localhost3", "admin", "admin")

	service.Fetch(context.Background())
}
