<template>
  <div class="absolute w-[200px] h-[200px] bg-red-500">
    <div class="flex">
      <div>
        <ConnectorPoint type="input"></ConnectorPoint>
      </div>
      <div>{{ props.data.id }}</div>
      <div>
        <ConnectorPoint type="output"></ConnectorPoint>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { TNode } from '@/composables/types'
import ConnectorPoint from './components/ConnectorPoint.vue'

const props = defineProps({
  data: {
    type: Object as PropType<TNode>,
    required: true,
  },
})
</script>
