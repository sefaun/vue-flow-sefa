import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { flowRef } from '@/composables/references'
import { nodes, points } from '@/composables/store'
import { useSelection } from '@/composables/Selection'
import { mouseButtons } from '@/composables/enums'
import { ctrlOrMetaKey } from '@/composables/utils'
import type { TEdge, TEdgeOptions } from '@/composables/types'

export function useEdge(opts: TEdgeOptions) {
  const selection = useSelection()
  const edgeElement: Ref<SVGPathElement> = ref()
  const options: Ref<TEdge> = ref(cloneDeep(opts.options))

  function getEdgeOptions() {
    return options.value
  }

  function setEdgeElement(value: SVGPathElement) {
    edgeElement.value = value
  }

  function click(event: MouseEvent) {
    if (event.button == mouseButtons.leftButton) {
      if (ctrlOrMetaKey(event)) {
        if (!selection.getEdgeSelection().includes(options.value.id)) {
          selection.setEdgeSelection(options.value.id)
        } else {
          selection.removeEdgeSelectionById(options.value.id)
        }
      } else {
        selection.setEdgeSelection(options.value.id)
      }
    }
  }

  function contextMenu(_event: MouseEvent) {
    console.log('contextMenu')
  }

  function setDimension() {
    const start = points.value[options.value.start.pointId]
    const end = points.value[options.value.end.pointId]

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
    nodes.value[options.value.start.nodeId].setEdge(options.value.id)
    nodes.value[options.value.end.nodeId].setEdge(options.value.id)
  }

  function destroy() {
    if (nodes.value[options.value.start.nodeId]) {
      nodes.value[options.value.start.nodeId].removeEdge(options.value.id)
    }
    if (nodes.value[options.value.end.nodeId]) {
      nodes.value[options.value.end.nodeId].removeEdge(options.value.id)
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
