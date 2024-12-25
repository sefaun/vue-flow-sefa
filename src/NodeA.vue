<template>
  <div class="absolute w-[200px] h-[200px] bg-red-500">
    <div class="flex">
      <div>
        <EdgePoint type="input" :outgoing-connection="false" :incoming-connection-limit="1"></EdgePoint>
        <EdgePoint type="input" :outgoing-connection="false"></EdgePoint>
      </div>
      <div>{{ props.data.id }}</div>
      <div>
        <EdgePoint type="output" :incoming-connection="false"></EdgePoint>
        <EdgePoint type="output" :incoming-connection="false" :outgoing-connection-limit="1"></EdgePoint>
      </div>
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
