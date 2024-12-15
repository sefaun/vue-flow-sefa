import type { Ref } from 'vue'
import { ref } from 'vue'
import { containerRef } from '@/composables/index'
import type { TuseConnectorPointOptions } from '@/composables/types'
import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/emitterEvents'

export function useConnectorPoint(data: TuseConnectorPointOptions) {
  const EE = useEventEmitter().getEventEmitter()
  const connectorPointElement: Ref<HTMLDivElement> = ref()
  const options = ref(data)

  function getConnectorPointElement() {
    return connectorPointElement.value
  }

  function setConnectorPointElement(value: HTMLDivElement) {
    connectorPointElement.value = value
  }

  function mouseDown() {
    console.log('mouseDown')
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseMove() {}

  function mouseUp() {
    console.log('mouseUp')
    containerRef.value.removeEventListener('mousemove', mouseMove)
  }

  function groundMouseUp() {
    containerRef.value.removeEventListener('mousemove', mouseMove)
  }

  function startEmitterListener() {
    EE.on(emitterEvents.container.groundMouseUp, groundMouseUp)
  }

  function destroyEmitterListener() {
    EE.removeListener(emitterEvents.container.groundMouseUp, groundMouseUp)
  }

  function start() {
    startEmitterListener()
  }

  function destroy() {
    destroyEmitterListener()
  }

  return {
    getConnectorPointElement,
    setConnectorPointElement,
    mouseDown,
    mouseUp,
    start,
    destroy,
  }
}
