<template>
  <div
    ref="nodeElementRef"
    class="absolute z-[1000] select-none"
    :style="{ left: `${nodeOptions.position.x}px`, top: `${nodeOptions.position.y}px`, ...nodeOptions.style }"
    @mousedown.stop.left="nodeData.mouseDown"
    @mouseup.stop.left="nodeData.mouseUp"
    @contextmenu.prevent.stop="nodeData.contextMenu"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useNode } from '@/composables/Node'
import type { TNode } from '@/composables/types'

const props = defineProps({
  data: {
    type: Object as PropType<TNode>,
    default: {},
    required: true,
  },
})

const nodeElementRef = ref()
const nodeData = useNode({
  options: props.data,
})

const nodeOptions = nodeData.getNodeOptions()

onMounted(() => {
  nodeData.setNodeElement(nodeElementRef.value)
  nodeData.start()
})

onBeforeUnmount(() => {
  nodeData.destroy()
})
</script>
