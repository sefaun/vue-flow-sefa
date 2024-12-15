<template>
  <div ref="flowRef" class="w-full h-full">
    <div v-for="node of props.nodes" :key="node.id">
      <slot name="node" v-bind="{ data: node }"></slot>
    </div>
    <svg width="100%" height="100%" class="pointer-events-none">
      <g v-for="connector of props.connectors" :key="connector.id" class="pointer-events-none">
        <slot name="connector" v-bind="{ data: connector }"></slot>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { flowRef } from '@/composables/index'
import type { TNode } from '@/composables/types'

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
</script>
