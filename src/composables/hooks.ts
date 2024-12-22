import { nextTick } from 'vue'
import { useFlow } from '@/composables/Flow'
import { useSelection } from '@/composables/Selection'
import { nodes } from '@/composables/store'

const flow = useFlow()
const selection = useSelection()

export function onBeforeEdgeConnect() {}
export function onNodeClick() {}

export function removeNodes(ids?: string[]) {
  const willRemoves: string[] = ids && ids.length ? ids : selection.getNodeSelection()
  const nodeEdges: string[] = []

  for (const id of willRemoves) {
    if (nodes.value[id]) {
      nodeEdges.push(...nodes.value[id].getEdges())
    }
  }

  if (nodeEdges.length) {
    const modifiedIds = [...new Set(nodeEdges)]
    const newEdges = flow.getEdges().filter((item) => !modifiedIds.includes(item.id))
    flow.setEdges(newEdges)
  }

  nextTick(() => {
    const newNodes = flow.getNodes().filter((item) => !willRemoves.includes(item.id))
    flow.setNodes(newNodes)
  })

  selection.clearSelections()
}

export function removeEdges(ids?: string[]) {
  console.log(selection.getEdgeSelection())
  const willRemoves: string[] = ids && ids.length ? ids : selection.getEdgeSelection()
  const newEdges = flow.getEdges().filter((item) => !willRemoves.includes(item.id))
  flow.setEdges(newEdges)
  selection.clearSelections()
}
