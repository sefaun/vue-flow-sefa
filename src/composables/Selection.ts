import type { Ref } from 'vue'
import { ref } from 'vue'

const nodeSelections: Ref<string[]> = ref([])
const selectedNodeEdges: Ref<string[]> = ref([])
const edgeSelections: Ref<string[]> = ref([])

export function useSelection() {
  function getNodeSelection() {
    return nodeSelections.value
  }

  function getEdgeSelection() {
    return edgeSelections.value
  }

  function getSelectedNodeEdges() {
    return selectedNodeEdges.value
  }

  function setNodeSelection(id: string) {
    if (!nodeSelections.value.includes(id)) {
      nodeSelections.value.push(id)
    }
  }

  function setEdgeSelection(id: string) {
    if (!edgeSelections.value.includes(id)) {
      edgeSelections.value.push(id)
    }
  }

  function setSelectedNodeEdges(...ids: string[]) {
    selectedNodeEdges.value.push(...ids)
  }

  function removeNodeSelectionById(id: string) {
    const index = nodeSelections.value.indexOf(id)
    if (index != -1) {
      nodeSelections.value.splice(index, 1)
    }
  }

  function removeEdgeSelectionById(id: string) {
    const index = edgeSelections.value.indexOf(id)
    if (index != -1) {
      edgeSelections.value.splice(index, 1)
    }
  }

  function clearSelections() {
    nodeSelections.value = []
    selectedNodeEdges.value = []
    edgeSelections.value = []
  }

  return {
    getNodeSelection,
    getEdgeSelection,
    getSelectedNodeEdges,
    setNodeSelection,
    setEdgeSelection,
    setSelectedNodeEdges,
    removeNodeSelectionById,
    removeEdgeSelectionById,
    clearSelections,
  }
}
