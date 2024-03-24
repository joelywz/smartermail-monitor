package monitor

import (
	"context"
	"log/slog"
	"sync"
	"time"

	"github.com/joelywz/smartermail-monitor/pkg/encrypter"
	"github.com/joelywz/smartermail-monitor/pkg/hook"
	"github.com/joelywz/smartermail-monitor/pkg/smartermail"
	"github.com/oklog/ulid/v2"
	"github.com/zhangyunhao116/skipmap"
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
	stats           *skipmap.OrderedMap[string, *Stats]
	statsHook       *hook.Emitter[[]*Stats]
	refreshTimeHook *hook.Emitter[time.Time]
	encryptionPw    string
}

func NewService(repo ServerRepo, refreshInterval time.Duration, fetcher Fetcher, encryptionPw string) *Service {
	return &Service{
		Repo:            repo,
		RefreshInterval: refreshInterval,
		fetcher:         fetcher,
		mutex:           sync.RWMutex{},
		stats:           skipmap.New[string, *Stats](),
		statsHook:       hook.NewEmitter[[]*Stats](),
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

		if _, ok := s.stats.Load(server.ID); !ok {
			s.stats.Store(server.ID, &Stats{
				ID:         server.ID,
				Status:     StatusFetching,
				ErrMessage: "",
				Host:       server.Host,
				Result:     nil,
			})
		}

		s.statsHook.EmitWithDebounce(s.Stats(), time.Millisecond*100)

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

			if err != nil {
				stats, _ := s.stats.Load(server.ID)
				stats.Status = StatusOffline
				stats.ErrMessage = err.Error()
				stats.Result = nil
			} else {
				stats, _ := s.stats.Load(server.ID)
				stats.Status = StatusOnline
				stats.ErrMessage = ""
				stats.Result = req
			}

			s.statsHook.EmitWithDebounce(s.Stats(), time.Millisecond*100)
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

	id := ulid.Make().String()

	err = s.Repo.Create(ctx, &Server{
		ID:       id,
		Host:     host,
		Username: encryptedUsername,
		Password: encryptedPw,
	})

	if err != nil {
		return err
	}

	s.stats.Store(id, &Stats{
		ID:         id,
		Status:     StatusFetching,
		ErrMessage: "",
		Host:       host,
		Result:     nil,
	})

	s.statsHook.Emit(s.Stats())

	go func() {
		req, err := s.fetcher.Fetch(ctx, host, username, password)

		if err != nil {
			stats, _ := s.stats.Load(id)
			stats.Status = StatusOffline
			stats.ErrMessage = err.Error()
			stats.Result = nil

		} else {
			stats, _ := s.stats.Load(id)
			stats.Status = StatusOnline
			stats.ErrMessage = ""
			stats.Result = req
		}

		s.statsHook.Emit(s.Stats())
	}()

	return nil

}

func (s *Service) DeleteServer(ctx context.Context, id string) error {

	if err := s.Repo.Delete(ctx, id); err != nil {
		return err
	}

	func() {
		s.stats.Delete(id)
	}()

	s.statsHook.Emit(s.Stats())

	return nil
}

func (s *Service) Stats() []*Stats {

	var stats []*Stats

	s.stats.Range(func(key string, value *Stats) bool {
		stats = append(stats, value)
		return true
	})

	return stats
}

func (s *Service) StatsHook() *hook.Emitter[[]*Stats] {
	return s.statsHook
}

func (s *Service) RefreshTimeHook() *hook.Emitter[time.Time] {
	return s.refreshTimeHook
}

func (s *Service) Close() {
	s.refreshTimer.Stop()
}
