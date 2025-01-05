import { nextTick } from 'vue'
import { useFlow } from '@/composables/Flow'
import { containerRef } from '@/composables/references'
import { useFlowController } from '@/composables/FlowController'
import { useSelection } from '@/composables/Selection'
import { nodes } from '@/composables/store'

const flow = useFlow()
const selection = useSelection()
const flowController = useFlowController()

export function onBeforeEdgeConnect() {}
export function onNodeClick() {}

export function removeNodes(ids?: string[]) {
  const willRemoves: string[] = ids && ids.length ? ids : selection.getNodeSelection()
  const nodeEdges: string[] = []

  for (const id of willRemoves) {
    if (nodes.value[id]) {
      nodeEdges.push(...nodes.value[id].getEdges())
    }
  }

  if (nodeEdges.length) {
    const modifiedIds = [...new Set(nodeEdges)]
    const newEdges = flow.getEdges().filter((item) => !modifiedIds.includes(item.id))
    flow.setEdges(newEdges)
  }

  nextTick(() => {
    const newNodes = flow.getNodes().filter((item) => !willRemoves.includes(item.id))
    flow.setNodes(newNodes)
  })

  selection.clearSelections()
}

export function removeEdges(ids?: string[]) {
  const willRemoves: string[] = ids && ids.length ? ids : selection.getEdgeSelection()
  const newEdges = flow.getEdges().filter((item) => !willRemoves.includes(item.id))
  flow.setEdges(newEdges)
  selection.clearSelections()
}

export function zoomIn() {
  const container = containerRef.value.getBoundingClientRect()
  const { scale, groundCenterX, groundCenterY } = flowController.centerZoom(-1, container.width / 2, container.height / 2)
  const matrix = flowController.getMatrix()

  flowController.setMatrix({
    x: matrix.x + groundCenterX * (1 - scale),
    y: matrix.y + groundCenterY * (1 - scale),
    z: matrix.z * scale,
  })
  flowController.renderMatrix(matrix)
}

export function zoomOut() {
  const container = containerRef.value.getBoundingClientRect()
  const { scale, groundCenterX, groundCenterY } = flowController.centerZoom(1, container.width / 2, container.height / 2)
  const matrix = flowController.getMatrix()

  flowController.setMatrix({
    x: matrix.x + groundCenterX * (1 - scale),
    y: matrix.y + groundCenterY * (1 - scale),
    z: matrix.z * scale,
  })
  flowController.renderMatrix(matrix)
}

export function zoomFit() {
  const { z } = flowController.getMatrix()
  let topPosition = Infinity
  let leftPosition = Infinity
  let bottomPosition = -Infinity
  let rightPosition = -Infinity

  const containerBounds = containerRef.value.getBoundingClientRect()
  const containerWidth = containerBounds.width
  const containerHeight = containerBounds.height

  for (const [_, value] of Object.entries(nodes.value)) {
    const element = value.getNodeElement()
    const position = value.getNodeOptions().position

    const elementBounds = element.getBoundingClientRect()

    const elementTop = position.y
    const elementLeft = position.x
    const elementBottom = position.y + elementBounds.height / z
    const elementRight = position.x + elementBounds.width / z

    topPosition = Math.min(topPosition, elementTop)
    leftPosition = Math.min(leftPosition, elementLeft)
    bottomPosition = Math.max(bottomPosition, elementBottom)
    rightPosition = Math.max(rightPosition, elementRight)
  }

  const padding = 0.1
  const boundsWidth = (rightPosition - leftPosition) * (1 + padding)
  const boundsHeight = (bottomPosition - topPosition) * (1 + padding)
  const boundsWidthCenter = boundsWidth / 2 + leftPosition
  const boundsHeightCenter = boundsHeight / 2 + topPosition
  const containerWidthCenter = containerWidth / 2
  const containerHeightCenter = containerHeight / 2

  const scaleX = containerWidth / boundsWidth
  const scaleY = containerHeight / boundsHeight
  const scale = Math.min(scaleX, scaleY) * (1 - padding)

  flowController.setMatrix({
    x: (containerWidthCenter - boundsWidthCenter) * scale,
    y: (containerHeightCenter - boundsHeightCenter) * scale,
    z: scale,
  })
  flowController.renderMatrix(flowController.getMatrix())
}
