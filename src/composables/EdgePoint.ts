import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { useEdgeCreator } from '@/composables/EdgeCreator'
import { useNodeSelection } from '@/composables/NodeSelection'
import type { TuseEdgePointOptions } from '@/composables/types'

export function useEdgePoint(data: TuseEdgePointOptions) {
  const edgeCreator = useEdgeCreator()
  const nodeSelection = useNodeSelection()
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
    nodeSelection.clearNodeSelection()
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
