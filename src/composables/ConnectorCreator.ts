import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { useEventEmitter } from '@/composables/EventEmitter'
import { emitterEvents } from '@/composables/emitterEvents'
import type { TuseConnectorCreatorConnectorOptions } from '@/composables/types'

const startingPoints = {
  start: {
    id: '',
    type: 'input',
    incomingConnection: true,
    outgoingConnection: true,
    ref: null,
  } as TuseConnectorCreatorConnectorOptions,
  end: {
    id: '',
    type: 'output',
    mode: 'free',
    incomingConnection: true,
    outgoingConnection: true,
    ref: null,
  } as TuseConnectorCreatorConnectorOptions,
}
const points = ref(cloneDeep(startingPoints))
const drawingStatus = ref(false)

export function useConnectorCreator() {
  const EE = useEventEmitter().getEventEmitter()

  function getPoints() {
    return points.value
  }

  function getDrawingStatus() {
    return drawingStatus.value
  }

  function startDrawing(value: TuseConnectorCreatorConnectorOptions) {
    points.value.start = cloneDeep(value)
    if (!points.value.start.outgoingConnection) {
      return
    }
    setDrawingStatus(true)

    console.log(points.value.start, 1)
    //
  }

  function endDrawing(value: TuseConnectorCreatorConnectorOptions) {
    if (!getDrawingStatus()) {
      return
    }
    points.value.end = cloneDeep(value)
    if (!points.value.end.incomingConnection) {
      return
    }
    console.log(points.value.end, 2)
    setDrawingStatus(false)
  }

  function setDrawingStatus(value: boolean) {
    drawingStatus.value = value
  }

  function resetPoints() {
    points.value = cloneDeep(startingPoints)
  }

  function groundMouseUp() {
    setDrawingStatus(false)
  }

  function startEmitterListener() {
    EE.on(emitterEvents.container.groundMouseUp, groundMouseUp)
  }

  function destroyEmitterListener() {
    EE.removeListener(emitterEvents.container.groundMouseUp, groundMouseUp)
  }

  function start() {
    resetPoints()
    startEmitterListener()
  }

  function destroy() {
    destroyEmitterListener()
  }

  return {
    getPoints,
    getDrawingStatus,
    setDrawingStatus,
    startDrawing,
    endDrawing,
    start,
    destroy,
  }
}
