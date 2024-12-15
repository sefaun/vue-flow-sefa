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

export type TConnectorPointTypes = 'input' | 'output'
export type TConnectorPointModes = 'free' | 'input2output' | 'output2input' | 'input2input' | 'output2output'
export type TuseConnectorPointOptions = {
  id: string
  type: TConnectorPointTypes
  mode: TConnectorPointModes
}
