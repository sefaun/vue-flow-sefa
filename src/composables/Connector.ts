import { ref } from 'vue'

export function useConnector(opts: any) {
  const connectorElement = ref()
  const connectorOptions = ref(opts)

  function getConnectorOptions() {
    return connectorOptions.value
  }

  function setConnectorElement(value: SVGPathElement) {
    connectorElement.value = value
  }

  function click(event: MouseEvent) {
    console.log('click')
  }

  function start() {}

  function destroy() {}

  return {
    getConnectorOptions,
    setConnectorElement,
    click,
    start,
    destroy,
  }
}
