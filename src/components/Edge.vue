<template>
  <path
    ref="edgeRef"
    class="fill-none stroke-[4] stroke-[green] hover:stroke-[6] hover:cursor-pointer pointer-events-auto"
    stroke-dasharray="15,5"
    marker-end="url(#arrow-end)"
    :id="props.data.id"
    @click.stop.left="edge.click"
    @contextmenu.prevent.stop="edge.contextMenu"
  ></path>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useEdge } from '@/composables/Edge'
import { edges } from '@/composables/store'
import type { TEdge } from '@/composables/types'

const props = defineProps({
  data: {
    type: Object as PropType<TEdge>,
    default: {},
    required: true,
  },
})

const edgeRef = ref()
const edge = useEdge({
  options: props.data,
})

onMounted(() => {
  edge.setEdgeElement(edgeRef.value)
  edge.start()
  edges.value[props.data.id] = edge
})

onBeforeUnmount(() => {
  edge.destroy()
  delete edges.value[props.data.id]
})
</script>
