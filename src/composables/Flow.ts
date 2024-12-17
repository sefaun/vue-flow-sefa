import { ref } from 'vue'

const nodes = ref([])
const edges = ref([])

export function useFlow() {
  function getNodes() {
    return nodes.value
  }

  function getEdges() {
    return edges.value
  }

  function setNodes(value) {
    nodes.value = value
  }

  function setEdges(value) {
    edges.value = value
  }

  return {
    getNodes,
    getEdges,
    setNodes,
    setEdges,
  }
}
