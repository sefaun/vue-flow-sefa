import { connectorPointType } from '@/composables/enums'
import { nodeEvents } from '@/composables/nodeEvents'

export type ValueOf<T> = T[keyof T]

export type TEventEmitterOptions = {
  maxListener: number
}

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

export type TConnectorPointTypeValues = ValueOf<typeof connectorPointType>
export type TuseConnectorPointOptions = {
  id: string
  type: TConnectorPointTypeValues
  incomingConnection: boolean
  outgoingConnection: boolean
}

export type TuseConnectorCreatorConnectorOptions = TuseConnectorPointOptions & {
  ref: HTMLDivElement
}
