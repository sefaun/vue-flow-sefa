import type { Ref } from 'vue'
import { ref } from 'vue'
import type { TuseConnectorPointOptions } from '@/composables/types'
import { useConnectorCreator } from './ConnectorCreator'

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

  function mouseDown(_event: MouseEvent) {
    console.log('mouseDown')
    connectorCreator.start()
    connectorCreator.startDrawing({
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
