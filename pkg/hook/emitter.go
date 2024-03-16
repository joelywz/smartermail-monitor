package hook

import (
	"sync"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

type Emitter[T any] struct {
	listeners map[string]chan T
	mu        sync.RWMutex
}

type ListenerFunc[T any] func(data T)

func NewEmitter[T any]() *Emitter[T] {
	return &Emitter[T]{}
}

func (emitter *Emitter[T]) AddListener(listener ListenerFunc[T]) string {
	emitter.mu.Lock()
	defer emitter.mu.Unlock()

	id := gonanoid.Must(8)
	ch := make(chan T, 1)
	emitter.listeners[id] = ch

	go func() {
		for data := range ch {
			listener(data)
		}
	}()

	return id
}

func (emitter *Emitter[T]) RemoveListener(id string) {
	emitter.mu.Lock()
	defer emitter.mu.Unlock()

	if ch, ok := emitter.listeners[id]; ok {
		close(ch)
		delete(emitter.listeners, id)
	}
}

func (emitter *Emitter[T]) Emit(data T) {
	emitter.mu.RLock()
	defer emitter.mu.RUnlock()

	for _, ch := range emitter.listeners {
		ch <- data
	}
}
