import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { useEdgeCreator } from '@/composables/EdgeCreator'
import { useSelection } from '@/composables/Selection'
import type { TuseEdgePointOptions } from '@/composables/types'

export function useEdgePoint(data: TuseEdgePointOptions) {
  const edgeCreator = useEdgeCreator()
  const selection = useSelection()
  const edgePointElement: Ref<HTMLDivElement> = ref()
  const options: Ref<TuseEdgePointOptions> = ref(cloneDeep(data))

  function getEdgePointElement() {
    return edgePointElement.value
  }

  function getOptions() {
    return options.value
  }

  function setEdgePointElement(value: HTMLDivElement) {
    edgePointElement.value = value
  }

  function mouseDown(event: MouseEvent) {
    selection.clearSelections()
    edgeCreator.start()
    edgeCreator.startDrawing(event, {
      ref: edgePointElement.value,
      ...getOptions(),
    })
  }

  function mouseUp(_event: MouseEvent) {
    edgeCreator.endDrawing({
      ref: edgePointElement.value,
      ...getOptions(),
    })
    edgeCreator.destroy()
  }

  return {
    getOptions,
    getEdgePointElement,
    setEdgePointElement,
    mouseDown,
    mouseUp,
  }
}
