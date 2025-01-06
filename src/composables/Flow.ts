import type { Ref } from 'vue'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import type { TNode, TEdge, TFlowOptions } from '@/composables/types'

const nodes: Ref<TNode[]> = ref([])
const edges: Ref<TEdge[]> = ref([])
const flowOptions: Ref<TFlowOptions> = ref()

export function useFlow() {
  function getNodes() {
    return nodes.value
  }

  function getEdges() {
    return edges.value
  }

  function getFlowOptions() {
    return flowOptions.value
  }

  function setNodes(value: TNode[]) {
    nodes.value = cloneDeep(value)
  }

  function setEdges(value: TEdge[]) {
    edges.value = cloneDeep(value)
  }

  function setFlowOptions(value: TFlowOptions) {
    flowOptions.value = cloneDeep(value)
  }

  return {
    getNodes,
    getEdges,
    getFlowOptions,
    setNodes,
    setEdges,
    setFlowOptions,
  }
}
