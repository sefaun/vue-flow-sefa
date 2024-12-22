import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
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
    nodes.value = cloneDeep(value)
  }

  function setEdges(value: TEdge[]) {
    edges.value = cloneDeep(value)
  }

  return {
    getNodes,
    getEdges,
    setNodes,
    setEdges,
  }
}
