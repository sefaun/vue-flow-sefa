import type { Ref } from 'vue'
import { ref } from 'vue'
import EventEmitter from 'events'
import type { TEventEmitterOptions } from '@/composables/types'

const ee: Ref<EventEmitter> = ref()

export function useEventEmitter() {
  function start(opts?: TEventEmitterOptions): void {
    ee.value = new EventEmitter()
    ee.value.setMaxListeners(opts?.maxListener || 1000)
  }

  function getEventEmitter() {
    return ee.value
  }

  return {
    getEventEmitter,
    start,
  }
}
