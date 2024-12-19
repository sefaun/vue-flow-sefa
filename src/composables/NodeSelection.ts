import type { Ref } from 'vue'
import { ref } from 'vue'

const nodeSelections: Ref<string[]> = ref([])
const selectedNodeEdges: Ref<string[]> = ref([])

export function useNodeSelection() {
  function getNodeSelection() {
    return nodeSelections.value
  }

  function getSelectedNodeEdges() {
    return selectedNodeEdges.value
  }

  function setNodeSelection(id: string) {
    if (!nodeSelections.value.includes(id)) {
      nodeSelections.value.push(id)
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

  function clearNodeSelection() {
    nodeSelections.value = []
  }

  return {
    getNodeSelection,
    getSelectedNodeEdges,
    setNodeSelection,
    setSelectedNodeEdges,
    removeNodeSelectionById,
    clearNodeSelection,
  }
}
