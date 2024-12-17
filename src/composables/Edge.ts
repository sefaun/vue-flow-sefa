import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { points } from '@/composables/states'
import type { TEdgeOptions } from '@/composables/types'

export function useEdge(opts: TEdgeOptions) {
  const edgeElement: Ref<SVGPathElement> = ref()
  const edgeOptions = cloneDeep(opts)

  function getEdgeOptions() {
    return edgeOptions
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
    const start = points.value[edgeOptions.start.pointId]
    const end = points.value[edgeOptions.end.pointId]

    if (start && end) {
      const startBounding = start.getBoundingClientRect()
      const endBounding = end.getBoundingClientRect()
      const startX = startBounding.left + startBounding.width / 2
      const startY = startBounding.top + startBounding.height / 2
      const endX = endBounding.left + endBounding.width / 2
      const endY = endBounding.top + endBounding.height / 2

      edgeElement.value.setAttribute(
        'd',
        `M ${startX},${startY} C ${startX + 200},${startY} ${endX - 200},${endY} ${endX},${endY}`
      )
    }
  }

  function start() {}

  function destroy() {}

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
