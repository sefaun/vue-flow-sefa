<template>
  <Container :class="'w-full h-screen bg-slate-400'">
    <Flow :nodes="nodes" :edges="edges">
      <template #node="{ data }">
        <NodeA v-if="data.type == 'a'" :data="data"></NodeA>
        <NodeB v-if="data.type == 'b'" :data="data"></NodeB>
      </template>
      <template #edge="{ data }">
        <Edge :data="data"></Edge>
      </template>
    </Flow>
  </Container>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { v4 } from 'uuid'
import Container from '@/components/Container.vue'
import Flow from '@/components/Flow.vue'
import Edge from '@/components/Edge.vue'
import { TNode, TEdge } from '@/composables/types'
import NodeA from './NodeA.vue'
import NodeB from './NodeB.vue'

const nodes: Ref<TNode[]> = ref([
  {
    id: v4(),
    type: 'a',
    data: {
      name: 'sefa',
    },
    position: {
      x: 50,
      y: 100,
    },
    style: {
      zIndex: 10,
    },
  },
  {
    id: v4(),
    type: 'b',
    data: {
      name: 'erdem',
    },
    position: {
      x: 400,
      y: 200,
    },
    style: {
      zIndex: 10,
    },
  },
])

const edges: Ref<TEdge[]> = ref([])
</script>

<style scoped></style>
