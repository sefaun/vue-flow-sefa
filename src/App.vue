<template>
  <div class="absolute top-0 left-0 z-20 flex">
    <button @click="removeNodes()" class="bg-red-200">remove</button>
    <button @click="removeEdges()" class="bg-red-200 ml-1">edge remove</button>
    <button @click="zoomIn()" class="bg-red-200 text-[16px] font-bold ml-1 px-1">+</button>
    <button @click="zoomOut()" class="bg-red-200 text-[16px] font-bold ml-1 px-1">-</button>
    <button @click="zoomFit()" class="bg-red-200 text-[16px] font-bold ml-1 px-1">[ ]</button>
  </div>
  <Container :class="'w-full h-screen bg-slate-400'">
    <Flow :nodes="nodes" :edges="edges" :plane="'horizontal'">
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
import Container from '@/components/Container.vue'
import Flow from '@/components/Flow.vue'
import Edge from '@/components/Edge.vue'
import { TNode, TEdge } from '@/composables/types'
import { removeNodes, removeEdges, zoomIn, zoomOut, zoomFit } from '@/composables/hooks'
import NodeA from './NodeA.vue'
import NodeB from './NodeB.vue'

const nodes: Ref<TNode[]> = ref([
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
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
