package hook_test

import (
	"sync"
	"testing"

	"github.com/joelywz/smartermail-monitor/pkg/hook"
)

func TestHook(t *testing.T) {
	emitter := hook.NewEmitter[int]()

	i := 0

	var wg sync.WaitGroup

	wg.Add(2)
	emitter.AddListener(func(data int) {
		i++
		wg.Done()
	})

	emitter.AddListener(func(data int) {
		i++
		wg.Done()
	})

	emitter.Emit(1)

	wg.Wait()

	if i != 2 {
		t.Fail()
	}

}
