<template>
  <div ref="flowRef" class="w-full h-full origin-center">
    <div>
      <Node v-for="node of flow.getNodes()" :key="node.id" :data="node">
        <slot name="node" v-bind="{ data: node }"></slot>
      </Node>
    </div>
    <svg class="absolute w-full h-full left-0 top-0 overflow-visible pointer-events-none">
      <defs>
        <marker
          id="arrow-end"
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
          id="drawing-end"
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
        ref="edgeDrawingRef"
        v-show="edgeCreator.getDrawingStatus()"
        class="fill-none stroke-[4] stroke-[green]"
        d="M 0,0 C 0,0 0,0 0,0"
        stroke-dasharray="15,5"
        marker-end="url(#drawing-end)"
      ></path>
      <g v-for="edge of flow.getEdges()" :key="edge.id" class="pointer-events-none">
        <slot name="edge" v-bind="{ data: edge }"></slot>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { flowRef, edgeDrawingRef } from '@/composables/references'
import { useFlow } from '@/composables/Flow'
import { useEdgeCreator } from '@/composables/EdgeCreator'
import type { TFlowPlaneValues, TNode } from '@/composables/types'
import Node from '@/components/Node.vue'

const props = defineProps({
  nodes: {
    type: Array as PropType<TNode[]>,
    default: [],
    required: true,
  },
  edges: {
    type: Array as PropType<any[]>,
    default: [],
    required: true,
  },
  plane: {
    type: String as PropType<TFlowPlaneValues>,
    default: 'horizontal',
    required: false,
  },
})

const flow = useFlow()
const edgeCreator = useEdgeCreator()

flow.setNodes(props.nodes)
flow.setEdges(props.edges)
</script>
