package monitor

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/joelywz/smartermail-monitor/pkg/smartermail"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

type Fetcher interface {
	Fetch(ctx context.Context, host string, username string, password string) *smartermail.RequestStats
}

type Service struct {
	Repo            ServerRepo
	RefreshInterval time.Duration
}

func NewService(repo ServerRepo, refreshInterval time.Duration) *Service {
	return &Service{
		Repo:            repo,
		RefreshInterval: refreshInterval,
	}
}

func (s *Service) Init() {

}

func (s *Service) Fetch(ctx context.Context) error {
	servers, err := s.Repo.GetAll(ctx)
	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	wg.Add(len(servers))
	defer wg.Wait()

	for _, server := range servers {
		go func(server *Server) {
			defer wg.Done()

			time.Sleep(2 * time.Second)

			fmt.Println(server.Host)
		}(server)
	}

	return nil
}

func (s *Service) AddServer(ctx context.Context, host string, username string, password string) error {
	return s.Repo.Create(ctx, &Server{
		ID:       gonanoid.Must(21),
		Host:     host,
		Username: username,
		Password: password,
	})
}

func (s *Service) DeleteServer(ctx context.Context, id string) error {
	return s.Repo.Delete(ctx, id)
}
