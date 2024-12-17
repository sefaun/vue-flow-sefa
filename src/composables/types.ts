import { edgePointType, planes } from '@/composables/enums'
import { nodeEvents } from '@/composables/nodeEvents'

export type ValueOf<T> = T[keyof T]

export type TEventEmitterOptions = {
  maxListener: number
}

export type TFlowPlaneValues = ValueOf<typeof planes>

export type TNode = {
  id: string
  type: string
  data: any
  position: {
    x: number
    y: number
  }
  style: {
    zIndex: number
  }
}

export type TuseNodeOptions = {
  options: TNode
}

export type TNodeEvents = ValueOf<typeof nodeEvents>

export type TNodeZIndexMessage = {
  id: string
}

export type TNodeEventMessage<T> = T

export type TNodeEventListenerData = TNodeZIndexMessage

export type TEdgePointTypeValues = ValueOf<typeof edgePointType>
export type TuseEdgePointOptions = {
  id: string
  type: TEdgePointTypeValues
  incomingConnection: boolean
  outgoingConnection: boolean
}

export type TEdgeOptions = {
  id: string
  start: {
    pointId: string
  }
  end: {
    pointId: string
  }
}

export type TuseEdgeCreatorEdgeOptions = TuseEdgePointOptions & {
  ref: HTMLDivElement
}
