<template>
  <div ref="flowRef" class="w-full h-full">
    <Node v-for="node of flow.getNodes()" :key="node.id" :data="node">
      <slot name="node" v-bind="{ data: node }"></slot>
    </Node>
    <svg width="100%" height="100%" class="pointer-events-none">
      <defs>
        <marker
          id="thinker-arrow-end"
          class="stroke-[green] fill-[green] stroke-[3]"
          markerWidth="5"
          markerHeight="5"
          viewBox="-6 -6 12 12"
          refX="10"
          refY="0"
          markerUnits="strokeWidth"
          orient="auto"
        >
          <polygon points="-2,0 -5,5 5,0 -5,-5"></polygon>
        </marker>
        <marker
          id="thinker-drawing-end"
          class="stroke-[green] fill-[green] stroke-[3]"
          markerWidth="5"
          markerHeight="5"
          viewBox="-6 -6 12 12"
          refX="0"
          refY="0"
          markerUnits="strokeWidth"
          orient="auto"
        >
          <circle cx="0" cy="0" r="1" />
        </marker>
      </defs>
      <path
        ref="connectorDrawingRef"
        v-show="connectorCreator.getDrawingStatus()"
        class="fill-none stroke-[4] stroke-[green]"
        d="M 0,0 C 0,0 0,0 0,0"
        stroke-dasharray="15,5"
        marker-end="url(#thinker-drawing-end)"
      ></path>
      <g v-for="connector of flow.getConnectors()" :key="connector.id" class="pointer-events-none">
        <slot name="connector" v-bind="{ data: connector }"></slot>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { cloneDeep } from 'lodash'
import { flowRef, connectorDrawingRef } from '@/composables/index'
import { useFlow } from '@/composables/Flow'
import { useConnectorCreator } from '@/composables/ConnectorCreator'
import type { TNode } from '@/composables/types'
import Node from '@/components/Node.vue'

const props = defineProps({
  nodes: {
    type: Array as PropType<TNode[]>,
    default: [],
  },
  connectors: {
    type: Array as PropType<any[]>,
    default: [],
  },
})

const flow = useFlow()
const connectorCreator = useConnectorCreator()

flow.setNodes(cloneDeep(props.nodes))
flow.setConnectors(cloneDeep(props.connectors))
</script>
