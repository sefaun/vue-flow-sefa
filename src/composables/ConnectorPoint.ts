import type { Ref } from 'vue'
import { ref } from 'vue'
import { containerRef } from '@/composables/index'
import type { TuseConnectorPointOptions } from '@/composables/types'
import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/emitterEvents'
import { useConnectorCreator } from './ConnectorCreator'

export function useConnectorPoint(data: TuseConnectorPointOptions) {
  const EE = useEventEmitter().getEventEmitter()
  const connectorCreator = useConnectorCreator()
  const connectorPointElement: Ref<HTMLDivElement> = ref()
  const options: Ref<TuseConnectorPointOptions> = ref(data)

  function getConnectorPointElement() {
    return connectorPointElement.value
  }

  function getOptions() {
    return options.value
  }

  function setConnectorPointElement(value: HTMLDivElement) {
    connectorPointElement.value = value
  }

  function mouseDown(_event: MouseEvent) {
    console.log('mouseDown')
    connectorCreator.start()
    connectorCreator.startDrawing({
      ref: connectorPointElement.value,
      ...getOptions(),
    })
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    event.preventDefault()
    // options.value.position.x = event.clientX - moveStarting.x
    // options.value.position.y = event.clientY - moveStarting.y
  }

  function mouseUp(_event: MouseEvent) {
    console.log('mouseUp')
    containerRef.value.removeEventListener('mousemove', mouseMove)
    connectorCreator.destroy()
  }

  function groundMouseUp() {
    containerRef.value.removeEventListener('mousemove', mouseMove)
    connectorCreator.destroy()
    console.log('mouseUp2')
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
    getOptions,
    getConnectorPointElement,
    setConnectorPointElement,
    mouseDown,
    mouseUp,
    start,
    destroy,
  }
}
