import type { Ref } from 'vue'
import { ref } from 'vue'
import { useEdgeCreator } from '@/composables/EdgeCreator'
import type { TuseEdgePointOptions } from '@/composables/types'

export function useEdgePoint(data: TuseEdgePointOptions) {
  const edgeCreator = useEdgeCreator()
  const edgePointElement: Ref<HTMLDivElement> = ref()
  const options: Ref<TuseEdgePointOptions> = ref(data)

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
