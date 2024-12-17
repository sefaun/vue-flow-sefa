import { ref } from 'vue'

const nodes = ref([])
const connectors = ref([])

export function useFlow() {
  function getNodes() {
    return nodes.value
  }

  function getConnectors() {
    return connectors.value
  }

  function setNodes(value) {
    nodes.value = value
  }

  function setConnectors(value) {
    connectors.value = value
  }

  return {
    getNodes,
    getConnectors,
    setNodes,
    setConnectors,
  }
}
