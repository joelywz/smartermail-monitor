package monitor

import (
	"context"
	"log/slog"
	"sync"
	"time"

	"github.com/joelywz/smartermail-monitor/pkg/encrypter"
	"github.com/joelywz/smartermail-monitor/pkg/hook"
	"github.com/joelywz/smartermail-monitor/pkg/smartermail"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

type Fetcher interface {
	Fetch(ctx context.Context, host string, username string, password string) (*smartermail.RequestStats, error)
}

type Service struct {
	Repo            ServerRepo
	RefreshInterval time.Duration
	refreshTimer    *time.Timer
	refreshTime     time.Time
	fetcher         Fetcher
	mutex           sync.RWMutex
	stats           map[string]*Stats
	statsHook       *hook.Emitter[map[string]*Stats]
	refreshTimeHook *hook.Emitter[time.Time]
	encryptionPw    string
}

func NewService(repo ServerRepo, refreshInterval time.Duration, fetcher Fetcher, encryptionPw string) *Service {
	return &Service{
		Repo:            repo,
		RefreshInterval: refreshInterval,
		fetcher:         fetcher,
		mutex:           sync.RWMutex{},
		stats:           make(map[string]*Stats),
		statsHook:       hook.NewEmitter[map[string]*Stats](),
		refreshTimeHook: hook.NewEmitter[time.Time](),
		encryptionPw:    encryptionPw,
	}
}

func (s *Service) Init() error {
	s.fetch(context.Background())
	s.resetTimer()
	return nil
}

func (s *Service) resetTimer() {
	s.refreshTime = time.Now().Add(s.RefreshInterval)

	if s.refreshTimer == nil {
		s.refreshTimer = time.NewTimer(time.Until(s.refreshTime))
	} else {
		s.refreshTimer.Reset(time.Until(s.refreshTime))
	}

	s.refreshTimeHook.Emit(s.refreshTime)

	go func() {
		<-s.refreshTimer.C
		s.fetch(context.Background())
		s.resetTimer()
	}()
}

func (s *Service) Refresh() {
	s.refreshTimer.Stop()
	s.fetch(context.Background())
	s.resetTimer()
}

func (s *Service) SetRefreshInterval(interval time.Duration) {
	s.RefreshInterval = interval
	s.refreshTimer.Stop()
	s.resetTimer()
}

func (s *Service) fetch(ctx context.Context) error {
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

			decryptedUsername, err := encrypter.Decrypt(server.Username, s.encryptionPw)

			if err != nil {
				slog.Error("Failed to decrypt username", err)
				return
			}

			decryptedPw, err := encrypter.Decrypt(server.Password, s.encryptionPw)

			if err != nil {
				slog.Error("Failed to decrypt password", err)
				return
			}

			req, err := s.fetcher.Fetch(ctx, server.Host, decryptedUsername, decryptedPw)

			s.mutex.Lock()
			defer s.mutex.Unlock()

			if err != nil {
				s.stats[server.ID] = &Stats{
					Online:     false,
					ErrMessage: err.Error(),
					Result:     nil,
				}
			}

			s.stats[server.ID] = &Stats{
				Online:     true,
				ErrMessage: "",
				Result:     req,
			}

			s.statsHook.EmitWithDebounce(s.stats, time.Millisecond*100)
		}(server)
	}

	return nil
}

func (s *Service) AddServer(ctx context.Context, host string, username string, password string) error {

	encryptedUsername, err := encrypter.Encrypt(username, s.encryptionPw)

	if err != nil {
		return err
	}

	encryptedPw, err := encrypter.Encrypt(password, s.encryptionPw)

	if err != nil {
		return err
	}

	return s.Repo.Create(ctx, &Server{
		ID:       gonanoid.Must(21),
		Host:     host,
		Username: encryptedUsername,
		Password: encryptedPw,
	})
}

func (s *Service) DeleteServer(ctx context.Context, id string) error {
	return s.Repo.Delete(ctx, id)
}

func (s *Service) Stats() map[string]*Stats {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	return s.stats
}

func (s *Service) StatsHook() *hook.Emitter[map[string]*Stats] {
	return s.statsHook
}

func (s *Service) RefreshTimeHook() *hook.Emitter[time.Time] {
	return s.refreshTimeHook
}

func (s *Service) Close() {
	s.refreshTimer.Stop()
}
