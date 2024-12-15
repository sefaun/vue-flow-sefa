import { ref } from 'vue'
import { cloneDeep } from 'lodash'

const startingPoints = {
  start: {
    nodeId: '',
    connectorPointId: '',
  },
  end: {
    nodeId: '',
    connectorPointId: '',
  },
} as const
const points = ref(cloneDeep(startingPoints))

export function useConnectorCreator() {
  function getPoints() {
    return points.value
  }

  function startDrawing(value: typeof startingPoints.start) {
    resetPoints()
    //
  }

  function endDrawing(value: typeof startingPoints.end) {}

  function resetPoints() {
    points.value = cloneDeep(startingPoints)
  }

  return {
    getPoints,
    startDrawing,
    endDrawing,
  }
}
