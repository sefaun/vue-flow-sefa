import type { Ref } from 'vue'
import { ref } from 'vue'
import type { TNode, TEdge } from '@/composables/types'

const nodes: Ref<TNode[]> = ref([])
const edges: Ref<TEdge[]> = ref([])

export function useFlow() {
  function getNodes() {
    return nodes.value
  }

  function getEdges() {
    return edges.value
  }

  function setNodes(value: TNode[]) {
    nodes.value = value
  }

  function setEdges(value: TEdge[]) {
    edges.value = value
  }

  return {
    getNodes,
    getEdges,
    setNodes,
    setEdges,
  }
}
