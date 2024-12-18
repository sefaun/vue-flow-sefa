import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { containerRef } from '@/composables/references'
import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/emitterEvents'
import { nodeEvents } from '@/composables/nodeEvents'
import { edges } from '@/composables/store'
import type {
  TNode,
  TNodeEventListenerData,
  TNodeEventMessage,
  TNodeEvents,
  TNodeZIndexMessage,
  TuseNodeOptions,
} from '@/composables/types'

export function useNode(data: TuseNodeOptions) {
  const EE = useEventEmitter().getEventEmitter()
  const nodeElement: Ref<HTMLDivElement> = ref()
  const options: Ref<TNode> = ref(cloneDeep(data.options))
  const nodeEdges: string[] = []

  function getNodeOptions() {
    return options.value
  }

  function getNodeElement() {
    return nodeElement.value
  }

  function setEdge(id: string) {
    nodeEdges.push(id)
  }

  function removeEdge(id: string) {
    const index = nodeEdges.findIndex((ids) => ids == id)
    nodeEdges.splice(index, 1)
  }

  function sendZindexMessage() {
    EE.emit(emitterEvents.node.mouseDown, {
      event: 'zIndex',
      data: {
        id: options.value.id,
      },
    })
  }

  function mouseDown(_event: MouseEvent) {
    sendZindexMessage()
    options.value.style.zIndex = 1001
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    event.preventDefault()
    options.value.position.x = event.movementX + options.value.position.x
    options.value.position.y = event.movementY + options.value.position.y

    for (const id of nodeEdges) {
      edges.value[id].setDimension()
    }
  }

  function mouseUp(_event: MouseEvent) {
    containerRef.value.removeEventListener('mousemove', mouseMove)
  }

  function contextMenu(_event: MouseEvent) {
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
    setEdge,
    removeEdge,
    start,
    destroy,
  }
}
