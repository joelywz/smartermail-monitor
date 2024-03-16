package monitor

import "context"

type ServerRepo interface {
	GetAll(ctx context.Context) ([]*Server, error)
	Create(ctx context.Context, server *Server) error
	Update(ctx context.Context, id string, server *Server) error
	Delete(ctx context.Context, id string) error
}
