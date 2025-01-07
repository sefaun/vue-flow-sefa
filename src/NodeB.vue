<template>
  <div class="w-[200px] h-[200px] bg-blue-500/60">
    <div class="absolute left-0 bottom-0">
      <EdgePoint type="input" :incoming-connection-limit="1"></EdgePoint>
    </div>
    <div class="flex">
      <div>
        <EdgePoint type="input" :outgoing-connection="false"></EdgePoint>
      </div>
      <div>{{ props.data.id }}</div>
      <div>
        <EdgePoint type="output" :incoming-connection="false"></EdgePoint>
      </div>
    </div>
    <div class="absolute right-0 bottom-0">
      <EdgePoint type="output" :incoming-connection="false" :outgoing-connection-limit="1"></EdgePoint>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { TNode } from '@/composables/types'
import EdgePoint from '@/components/EdgePoint.vue'

const props = defineProps({
  data: {
    type: Object as PropType<TNode>,
    required: true,
  },
})
</script>
