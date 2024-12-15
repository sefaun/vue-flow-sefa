<template>
  <Container :class="'w-full h-screen bg-slate-400'">
    <Flow :nodes="nodes" :connectors="connectors">
      <template #node="{ data }">
        <NodeA v-if="data.type == 'a'" :data="data"></NodeA>
        <NodeB v-if="data.type == 'b'" :data="data"></NodeB>
      </template>
      <template #connector="{ data }">
        <Connector :data="data"></Connector>
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
import Connector from '@/components/Connector.vue'
import { TNode } from '@/composables/types'
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

const connectors: Ref<unknown[]> = ref([
  {
    id: 1,
    input: [
      {
        from: {
          node: {
            id: 'a',
            connector: 1,
          },
        },
        to: 'ddr',
      },
    ],
  },
])
</script>

<style scoped></style>
