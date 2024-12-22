import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/events'

export function useContainer() {
  const eventEmitter = useEventEmitter()
  const ee = eventEmitter.getEventEmitter()

  function mouseUp(_event: MouseEvent) {
    ee.emit(emitterEvents.container.groundMouseUp)
  }

  function start() {
    window.addEventListener('mouseup', mouseUp, true)
  }

  function destroy() {
    window.removeEventListener('mouseup', mouseUp, true)
  }

  return {
    start,
    destroy,
  }
}
