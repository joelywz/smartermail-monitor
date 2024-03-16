package hook_test

import (
	"sync"
	"testing"
	"time"

	"github.com/joelywz/smartermail-monitor/pkg/hook"
)

func TestHook(t *testing.T) {
	t.Run("Emit", func(t *testing.T) {
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

	})

	t.Run("Emit with debounce", func(t *testing.T) {
		emitter := hook.NewEmitter[int]()

		i := 0
		execCount := 0

		emitter.AddListener(func(data int) {
			execCount++
			i = data
		})

		emitter.EmitWithDebounce(1, time.Millisecond*200)
		emitter.EmitWithDebounce(2, time.Millisecond*200)
		emitter.EmitWithDebounce(3, time.Millisecond*200)
		emitter.EmitWithDebounce(4, time.Millisecond*200)
		emitter.EmitWithDebounce(5, time.Millisecond*200)
		emitter.EmitWithDebounce(6, time.Millisecond*200)
		time.Sleep(time.Millisecond * 300)

		if i != 6 && execCount != 1 {
			t.Fail()
		}

	})

}
