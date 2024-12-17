import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { connectorDrawingRef, containerRef } from '@/composables/index'
import { useFlow } from '@/composables/Flow'
import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/emitterEvents'
import type { TuseConnectorCreatorConnectorOptions } from '@/composables/types'

const startingPoints = {
  start: {
    id: '',
    type: 'input',
    incomingConnection: true,
    outgoingConnection: true,
    ref: null,
  } as TuseConnectorCreatorConnectorOptions,
  end: {
    id: '',
    type: 'output',
    mode: 'free',
    incomingConnection: true,
    outgoingConnection: true,
    ref: null,
  } as TuseConnectorCreatorConnectorOptions,
}
const points = ref(cloneDeep(startingPoints))
const drawingStatus = ref(false)

export function useConnectorCreator() {
  const flow = useFlow()
  const EE = useEventEmitter().getEventEmitter()
  const connectorDrawingData = {
    startX: 0,
    startY: 0,
    mouseMoveX: 0,
    mouseMoveY: 0,
  }

  function getPoints() {
    return points.value
  }

  function getDrawingStatus() {
    return drawingStatus.value
  }

  function startDrawing(event: MouseEvent, value: TuseConnectorCreatorConnectorOptions) {
    points.value.start = cloneDeep(value)
    if (!points.value.start.outgoingConnection) {
      return
    }
    setDrawingStatus(true)

    const bounding = points.value.start.ref.getBoundingClientRect()
    connectorDrawingData.startX = bounding.left + bounding.width / 2
    connectorDrawingData.startY = bounding.top + bounding.height / 2
    connectorDrawingData.mouseMoveX = event.clientX
    connectorDrawingData.mouseMoveY = event.clientY
    setDimensionAttribute(connectorDrawingData)
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    event.preventDefault()
    connectorDrawingData.mouseMoveX = event.clientX
    connectorDrawingData.mouseMoveY = event.clientY
    setDimensionAttribute(connectorDrawingData)
  }

  function endDrawing(value: TuseConnectorCreatorConnectorOptions) {
    if (!getDrawingStatus()) {
      return
    }
    commonMouseUp()

    points.value.end = cloneDeep(value)
    if (!points.value.end.incomingConnection) {
      return
    }

    flow.getConnectors().push({
      id: Math.floor(Math.random() * 50),
    })
  }

  function setDrawingStatus(value: boolean) {
    drawingStatus.value = value
  }

  function setDimensionAttribute(data: typeof connectorDrawingData) {
    connectorDrawingRef.value.setAttribute(
      'd',
      `M ${data.startX},${data.startY} C ${data.startX + 200},${data.startY} ${data.mouseMoveX - 200},${data.mouseMoveY} ${
        data.mouseMoveX
      },${data.mouseMoveY}`
    )
  }

  function resetPoints() {
    points.value = cloneDeep(startingPoints)
  }

  function commonMouseUp() {
    setDrawingStatus(false)
    containerRef.value.removeEventListener('mousemove', mouseMove)
    connectorDrawingRef.value.removeAttribute('d')
  }

  function groundMouseUp() {
    commonMouseUp()
  }

  function startEmitterListener() {
    EE.on(emitterEvents.container.groundMouseUp, groundMouseUp)
  }

  function destroyEmitterListener() {
    EE.removeListener(emitterEvents.container.groundMouseUp, groundMouseUp)
  }

  function start() {
    resetPoints()
    startEmitterListener()
  }

  function destroy() {
    destroyEmitterListener()
  }

  return {
    getPoints,
    getDrawingStatus,
    setDrawingStatus,
    startDrawing,
    endDrawing,
    start,
    destroy,
  }
}
