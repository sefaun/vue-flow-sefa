import type { Ref } from 'vue'
import { ref } from 'vue'
import { useConnectorCreator } from '@/composables/ConnectorCreator'
import type { TuseConnectorPointOptions } from '@/composables/types'

export function useConnectorPoint(data: TuseConnectorPointOptions) {
  const connectorCreator = useConnectorCreator()
  const connectorPointElement: Ref<HTMLDivElement> = ref()
  const options: Ref<TuseConnectorPointOptions> = ref(data)

  function getConnectorPointElement() {
    return connectorPointElement.value
  }

  function getOptions() {
    return options.value
  }

  function setConnectorPointElement(value: HTMLDivElement) {
    connectorPointElement.value = value
  }

  function mouseDown(event: MouseEvent) {
    console.log('mouseDown')
    connectorCreator.start()
    connectorCreator.startDrawing(event, {
      ref: connectorPointElement.value,
      ...getOptions(),
    })
  }

  function mouseUp(_event: MouseEvent) {
    console.log('mouseUp')
    connectorCreator.endDrawing({
      ref: connectorPointElement.value,
      ...getOptions(),
    })
    connectorCreator.destroy()
  }

  return {
    getOptions,
    getConnectorPointElement,
    setConnectorPointElement,
    mouseDown,
    mouseUp,
  }
}
