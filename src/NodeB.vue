<template>
  <div class="absolute w-[200px] h-[200px] bg-blue-500">
    <div class="flex">
      <div>
        <ConnectorPoint type="input" :outgoing-connection="false"></ConnectorPoint>
      </div>
      <div>{{ props.data.id }}</div>
      <div>
        <ConnectorPoint type="output" :incoming-connection="false"></ConnectorPoint>
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
