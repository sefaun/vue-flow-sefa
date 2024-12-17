import { ref } from 'vue'
import { v4 } from 'uuid'
import { cloneDeep } from 'lodash'
import { edgeDrawingRef, containerRef } from '@/composables/references'
import { useFlow } from '@/composables/Flow'
import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/emitterEvents'
import type { TuseEdgeCreatorEdgeOptions } from '@/composables/types'

const startingPoints = {
  start: {
    id: '',
    type: 'input',
    incomingConnection: true,
    outgoingConnection: true,
    ref: null,
  } as TuseEdgeCreatorEdgeOptions,
  end: {
    id: '',
    type: 'output',
    mode: 'free',
    incomingConnection: true,
    outgoingConnection: true,
    ref: null,
  } as TuseEdgeCreatorEdgeOptions,
}
const points = ref(cloneDeep(startingPoints))
const drawingStatus = ref(false)

export function useEdgeCreator() {
  const flow = useFlow()
  const EE = useEventEmitter().getEventEmitter()
  const edgeDrawingData = {
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

  function startDrawing(event: MouseEvent, value: TuseEdgeCreatorEdgeOptions) {
    points.value.start = cloneDeep(value)
    if (!points.value.start.outgoingConnection) {
      return
    }

    setDrawingStatus(true)
    const bounding = points.value.start.ref.getBoundingClientRect()
    edgeDrawingData.startX = bounding.left + bounding.width / 2
    edgeDrawingData.startY = bounding.top + bounding.height / 2
    edgeDrawingData.mouseMoveX = event.clientX
    edgeDrawingData.mouseMoveY = event.clientY
    setDimensionAttribute(edgeDrawingData)
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    event.preventDefault()
    edgeDrawingData.mouseMoveX = event.clientX
    edgeDrawingData.mouseMoveY = event.clientY
    setDimensionAttribute(edgeDrawingData)
  }

  function endDrawing(value: TuseEdgeCreatorEdgeOptions) {
    if (!getDrawingStatus()) {
      return
    }

    commonMouseUp()
    points.value.end = cloneDeep(value)
    if (!points.value.end.incomingConnection) {
      return
    }

    flow.getEdges().push({
      id: v4(),
      start: {
        pointId: points.value.start.id,
      },
      end: {
        pointId: points.value.end.id,
      },
    })
  }

  function setDrawingStatus(value: boolean) {
    drawingStatus.value = value
  }

  function setDimensionAttribute(data: typeof edgeDrawingData) {
    edgeDrawingRef.value.setAttribute(
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
    edgeDrawingRef.value.removeAttribute('d')
  }

  function groundMouseUp() {
    setTimeout(() => {
      commonMouseUp()
    }, 50)
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
