import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { edgeDrawingRef, containerRef, flowRef } from '@/composables/references'
import { useFlow } from '@/composables/Flow'
import { useEventEmitter } from '@/composables/EventEmitter'
import { useFlowController } from '@/composables/FlowController'
import { edges, nodes, points } from '@/composables/store'
import { emitterEvents } from '@/composables/events'
import type { TEdge, TuseEdgeCreatorEdgeOptions } from '@/composables/types'

const startingPoints = {
  start: {
    id: '',
    nodeId: '',
    type: 'input',
    incomingConnection: true,
    outgoingConnection: true,
    ref: null,
  } as TuseEdgeCreatorEdgeOptions,
  end: {
    id: '',
    nodeId: '',
    type: 'output',
    incomingConnection: true,
    outgoingConnection: true,
    ref: null,
  } as TuseEdgeCreatorEdgeOptions,
}
const edgePoints = ref(cloneDeep(startingPoints))
const drawingStatus = ref(false)

export function useEdgeCreator() {
  const flow = useFlow()
  const flowController = useFlowController()
  const EE = useEventEmitter().getEventEmitter()
  let flowBounding: DOMRect = null
  const edgeDrawingData = {
    startX: 0,
    startY: 0,
    mouseMoveX: 0,
    mouseMoveY: 0,
  }

  function getPoints() {
    return edgePoints.value
  }

  function getDrawingStatus() {
    return drawingStatus.value
  }

  function startDrawing(event: MouseEvent, value: TuseEdgeCreatorEdgeOptions) {
    edgePoints.value.start = cloneDeep(value)
    if (!edgePoints.value.start.outgoingConnection) {
      return
    }

    setDrawingStatus(true)
    flowBounding = flowRef.value.getBoundingClientRect()
    const bounding = edgePoints.value.start.ref.getBoundingClientRect()

    edgeDrawingData.startX = flowController.getRealValue(bounding.left - flowBounding.left + bounding.width / 2)
    edgeDrawingData.startY = flowController.getRealValue(bounding.top - flowBounding.top + bounding.height / 2)
    edgeDrawingData.mouseMoveX = flowController.getRealValue(event.clientX - flowBounding.left)
    edgeDrawingData.mouseMoveY = flowController.getRealValue(event.clientY - flowBounding.top)
    setDimensionAttribute(edgeDrawingData)

    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    event.preventDefault()

    edgeDrawingData.mouseMoveX = flowController.getRealValue(event.clientX - flowBounding.left)
    edgeDrawingData.mouseMoveY = flowController.getRealValue(event.clientY - flowBounding.top)
    setDimensionAttribute(edgeDrawingData)
  }

  function endDrawing(value: TuseEdgeCreatorEdgeOptions) {
    if (!getDrawingStatus()) {
      return
    }

    commonMouseUp()
    edgePoints.value.end = cloneDeep(value)

    if (!edgePoints.value.end.incomingConnection) {
      return
    }

    if (edgePoints.value.start.id == edgePoints.value.end.id) {
      return
    }

    const edgeData = {
      id: crypto.randomUUID(),
      start: {
        nodeId: edgePoints.value.start.nodeId,
        pointId: edgePoints.value.start.id,
      },
      end: {
        nodeId: edgePoints.value.end.nodeId,
        pointId: edgePoints.value.end.id,
      },
    }

    if (
      !checkMultipleConnectionForSamePoint(edgeData, [
        ...new Set([...nodes.value[edgeData.start.nodeId].getEdges(), ...nodes.value[edgeData.end.nodeId].getEdges()]),
      ])
    ) {
      return
    }

    if (!checkPointConnectionLimits(edgeData)) {
      return
    }

    flow.getEdges().push(edgeData)
  }

  function checkPointConnectionLimits(newEdge: TEdge) {
    const outgoingLimit = points.value[newEdge.start.pointId].getOptions().outgoingConnectionLimit
    const incomingLimit = points.value[newEdge.end.pointId].getOptions().incomingConnectionLimit
    let outgoingCounter = 0
    let incomingCounter = 0

    if (outgoingLimit != -1) {
      for (const [_, value] of Object.entries(edges.value)) {
        if (value.getEdgeOptions().start.pointId == newEdge.start.pointId) {
          outgoingCounter++
        }

        if (outgoingCounter >= outgoingLimit) {
          return false
        }
      }
    }

    if (incomingLimit != -1) {
      for (const [_, value] of Object.entries(edges.value)) {
        if (value.getEdgeOptions().end.pointId == newEdge.end.pointId) {
          incomingCounter++
        }

        if (incomingCounter >= incomingLimit) {
          return false
        }
      }
    }

    return true
  }

  function checkMultipleConnectionForSamePoint(newEdge: TEdge, ids: string[]): boolean {
    for (const id of ids) {
      const edge = edges.value[id].getEdgeOptions()

      if (
        edge.start.nodeId == newEdge.start.nodeId &&
        edge.start.pointId == newEdge.start.pointId &&
        edge.end.nodeId == newEdge.end.nodeId &&
        edge.end.pointId == newEdge.end.pointId
      ) {
        return false
      }
    }

    return true
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
    edgePoints.value = cloneDeep(startingPoints)
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
