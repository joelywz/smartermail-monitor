package monitor_test

import (
	"context"
	"math/rand"
	"sync"
	"testing"
	"time"

	"github.com/joelywz/smartermail-monitor/internal/monitor"
	"github.com/joelywz/smartermail-monitor/pkg/smartermail"
)

func TestService(t *testing.T) {
	service := monitor.NewService(NewMemRepo(), time.Millisecond*200, NewFetcher())

	service.AddServer(context.Background(), "localhost", "admin", "admin")
	service.AddServer(context.Background(), "localhost2", "admin", "admin")
	service.AddServer(context.Background(), "localhost3", "admin", "admin")

	service.Init()

	mu := sync.Mutex{}
	statCount := 0

	service.StatsHook().AddListener(func(stats map[string]*monitor.Stats) {
		mu.Lock()
		defer mu.Unlock()
		statCount++
		t.Log(statCount)
	})

	time.Sleep(time.Second * 1)

	if statCount < 4 {
		t.Fail()
	}

}

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

var _ monitor.Fetcher = (*MockFetcher)(nil)

func NewFetcher() *MockFetcher {
	return &MockFetcher{}
}

type MockFetcher struct{}

// Fetch implements monitor.Fetcher.
func (*MockFetcher) Fetch(ctx context.Context, host string, username string, password string) (*smartermail.RequestStats, error) {

	return &smartermail.RequestStats{
		Imap:            true,
		ImapThreadCount: rand.Intn(20),
		Pop:             true,
		PopThreadCount:  rand.Intn(20),
		Uptime:          1000,
		Smtp:            true,
		SmtpThreadCount: rand.Intn(20),
		Spool:           true,
		SpoolCount:      rand.Intn(100),
	}, nil
}
