import type { Ref } from 'vue'
import { ref } from 'vue'
import { containerRef } from '@/composables/index'
import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/emitterEvents'
import { nodeEvents } from '@/composables/nodeEvents'
import type {
  TNodeEventListenerData,
  TNodeEventMessage,
  TNodeEvents,
  TNodeZIndexMessage,
  TuseNodeOptions,
} from '@/composables/types'

export function useNode(data: TuseNodeOptions) {
  const EE = useEventEmitter().getEventEmitter()
  const nodeElement: Ref<HTMLDivElement> = ref()
  const options = ref(data.options)
  let moveStarting = {
    x: 0,
    y: 0,
  }

  function getNodeOptions() {
    return options.value
  }

  function getNodeElement() {
    return nodeElement.value
  }

  function sendZindexMessage() {
    EE.emit(emitterEvents.node.mouseDown, {
      event: 'zIndex',
      data: {
        id: options.value.id,
      },
    })
  }

  function mouseDown(event: MouseEvent) {
    console.log('down')
    sendZindexMessage()
    options.value.style.zIndex = 1001
    moveStarting.x = event.clientX - nodeElement.value.getBoundingClientRect().left
    moveStarting.y = event.clientY - nodeElement.value.getBoundingClientRect().top
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    event.preventDefault()
    options.value.position.x = event.clientX - moveStarting.x
    options.value.position.y = event.clientY - moveStarting.y
  }

  function mouseUp(_event: MouseEvent) {
    console.log('up')
    containerRef.value.removeEventListener('mousemove', mouseMove)
  }

  function contextMenu(_event: MouseEvent) {
    console.log('contextMenu')
    sendZindexMessage()
    options.value.style.zIndex = 1001
  }

  function setNodeElement(element: HTMLDivElement) {
    nodeElement.value = element
  }

  function groundMouseUp() {
    containerRef.value.removeEventListener('mousemove', mouseMove)
  }

  function mouseDownEvent(message: { event: TNodeEvents; data?: TNodeEventListenerData }) {
    switch (message.event) {
      case nodeEvents.zIndex:
        if ((message.data as TNodeEventMessage<TNodeZIndexMessage>).id != options.value.id) {
          options.value.style.zIndex = 1000
        }
        break

      default:
        break
    }
  }

  function startEmitterListener() {
    EE.on(emitterEvents.container.groundMouseUp, groundMouseUp)
    EE.on(emitterEvents.node.mouseDown, mouseDownEvent)
  }

  function destroyEmitterListener() {
    EE.removeListener(emitterEvents.container.groundMouseUp, groundMouseUp)
    EE.removeListener(emitterEvents.node.mouseDown, mouseDownEvent)
  }

  function start() {
    startEmitterListener()
  }

  function destroy() {
    destroyEmitterListener()
  }

  return {
    getNodeElement,
    getNodeOptions,
    mouseDown,
    mouseMove,
    mouseUp,
    contextMenu,
    setNodeElement,
    start,
    destroy,
  }
}