import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { containerRef } from '@/composables/references'
import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/emitterEvents'
import { nodeEvents } from '@/composables/nodeEvents'
import { edges, nodes } from '@/composables/store'
import { useSelection } from '@/composables/Selection'
import { mouseButtons } from '@/composables/enums'
import { ctrlOrMetaKey } from '@/composables/utils'
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
  const selection = useSelection()
  const nodeElement: Ref<HTMLDivElement> = ref()
  const options: Ref<TNode> = ref(cloneDeep(data.options))
  const nodeEdges: string[] = []
  let nodeMoveStatus = false

  function getNodeOptions() {
    return options.value
  }

  function getNodeElement() {
    return nodeElement.value
  }

  function getEdges() {
    return nodeEdges
  }

  function getNodeMoveStatus() {
    return nodeMoveStatus
  }

  function setEdge(id: string) {
    if (!nodeEdges.includes(id)) {
      nodeEdges.push(id)
    }
  }

  function setNodeMoveStatus(value: boolean) {
    nodeMoveStatus = value
  }

  function removeEdge(id: string) {
    const index = nodeEdges.indexOf(id)
    if (index != -1) {
      nodeEdges.splice(index, 1)
    }
  }

  function sendZindexMessage() {
    EE.emit(emitterEvents.node.mouseDown, {
      event: 'zIndex',
      data: {
        id: options.value.id,
      },
    })
  }

  function edgeMovementOperations() {
    if (selection.getNodeSelection().length > 1) {
      let nodeEdgeIds = []

      for (const id of selection.getNodeSelection()) {
        nodeEdgeIds.push(...nodes.value[id].getEdges())
      }

      selection.setSelectedNodeEdges(...new Set(nodeEdgeIds))
    }
  }

  function controlNodes(event: MouseEvent) {
    for (const id of selection.getNodeSelection().length > 1 ? selection.getNodeSelection() : [options.value.id]) {
      nodes.value[id].nodeMove(event.movementX, event.movementY)
    }
  }

  function controlNodeEdges() {
    for (const id of selection.getNodeSelection().length > 1 ? selection.getSelectedNodeEdges() : nodeEdges) {
      edges.value[id].setDimension()
    }
  }

  function selectionOperations(event: MouseEvent) {
    if (event.button == mouseButtons.leftButton) {
      if (ctrlOrMetaKey(event)) {
        if (!selection.getNodeSelection().includes(options.value.id)) {
          selection.setNodeSelection(options.value.id)
        } else {
          selection.removeNodeSelectionById(options.value.id)
        }
        return
      }

      if (!ctrlOrMetaKey(event) && !getNodeMoveStatus()) {
        selection.clearSelections()
        selection.setNodeSelection(options.value.id)
        return
      }

      if (ctrlOrMetaKey(event) && !getNodeMoveStatus()) {
        if (!selection.getNodeSelection().includes(options.value.id)) {
          selection.setNodeSelection(options.value.id)
        } else {
          selection.removeNodeSelectionById(options.value.id)
        }
        return
      }
    }
  }

  function mouseDown(_event: MouseEvent) {
    sendZindexMessage()
    options.value.style.zIndex = 1001
    edgeMovementOperations()
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    event.preventDefault()
    setNodeMoveStatus(true)
    controlNodes(event)
    controlNodeEdges()
  }

  function mouseUp(event: MouseEvent) {
    selectionOperations(event)
    setNodeMoveStatus(false)
    containerRef.value.removeEventListener('mousemove', mouseMove)
  }

  function contextMenu(_event: MouseEvent) {
    sendZindexMessage()
    options.value.style.zIndex = 1001
  }

  function nodeMove(x: number, y: number) {
    options.value.position.x = x + options.value.position.x
    options.value.position.y = y + options.value.position.y
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
    getEdges,
    mouseDown,
    mouseMove,
    mouseUp,
    contextMenu,
    nodeMove,
    setNodeElement,
    setEdge,
    removeEdge,
    start,
    destroy,
  }
}
