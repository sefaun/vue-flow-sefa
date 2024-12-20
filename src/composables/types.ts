import { useNode } from '@/composables/Node'
import { useEdgePoint } from '@/composables/EdgePoint'
import { useEdge } from '@/composables/Edge'
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

export type TEdge = {
  id: string
  start: {
    nodeId: string
    pointId: string
  }
  end: {
    nodeId: string
    pointId: string
  }
}

export type TuseNode = ReturnType<typeof useNode>
export type TuseEdge = ReturnType<typeof useEdge>
export type TuseEdgePoint = ReturnType<typeof useEdgePoint>

export type TuseNodeOptions = {
  options: TNode
}

export type TEdgeOptions = {
  options: TEdge
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
  nodeId: string
  type: TEdgePointTypeValues
  incomingConnection: boolean
  outgoingConnection: boolean
  incomingConnectionLimit: number
  outgoingConnectionLimit: number
}

export type TuseEdgeCreatorEdgeOptions = TuseEdgePointOptions & {
  ref: HTMLDivElement
}
