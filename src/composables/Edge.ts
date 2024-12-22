import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { flowRef } from '@/composables/references'
import { nodes, points } from '@/composables/store'
import type { TEdge, TEdgeOptions } from '@/composables/types'

export function useEdge(opts: TEdgeOptions) {
  const edgeElement: Ref<SVGPathElement> = ref()
  const edgeOptions: Ref<TEdge> = ref(cloneDeep(opts.options))

  function getEdgeOptions() {
    return edgeOptions.value
  }

  function setEdgeElement(value: SVGPathElement) {
    edgeElement.value = value
  }

  function click(_event: MouseEvent) {
    console.log('click')
  }

  function contextMenu(_event: MouseEvent) {
    console.log('contextMenu')
  }

  function setDimension() {
    const start = points.value[edgeOptions.value.start.pointId]
    const end = points.value[edgeOptions.value.end.pointId]

    if (start && end) {
      const flowBounding = flowRef.value.getBoundingClientRect()
      const startBounding = start.getBoundingClientRect()
      const endBounding = end.getBoundingClientRect()
      const startX = startBounding.left - flowBounding.left + startBounding.width / 2
      const startY = startBounding.top - flowBounding.top + startBounding.height / 2
      const endX = endBounding.left - flowBounding.left + endBounding.width / 2
      const endY = endBounding.top - flowBounding.top + endBounding.height / 2

      edgeElement.value.setAttribute(
        'd',
        `M ${startX},${startY} C ${startX + 200},${startY} ${endX - 200},${endY} ${endX},${endY}`
      )
    }
  }

  function start() {
    setDimension()
    nodes.value[edgeOptions.value.start.nodeId].setEdge(edgeOptions.value.id)
    nodes.value[edgeOptions.value.end.nodeId].setEdge(edgeOptions.value.id)
  }

  function destroy() {
    if (nodes.value[edgeOptions.value.start.nodeId]) {
      nodes.value[edgeOptions.value.start.nodeId].removeEdge(edgeOptions.value.id)
    }
    if (nodes.value[edgeOptions.value.end.nodeId]) {
      nodes.value[edgeOptions.value.end.nodeId].removeEdge(edgeOptions.value.id)
    }
  }

  return {
    getEdgeOptions,
    setEdgeElement,
    setDimension,
    contextMenu,
    click,
    start,
    destroy,
  }
}
