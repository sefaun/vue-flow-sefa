<template>
  <div
    ref="containerRef"
    class="relative cursor-grab overflow-hidden"
    @mousedown.prevent.stop.left="flowController.mouseDown"
    @mouseup.prevent.stop.left="flowController.mouseUp"
    @wheel.prevent="flowController.wheel"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { containerRef } from '@/composables/references'
import { useContainer } from '@/composables/Container'
import { useEventEmitter } from '@/composables/EventEmitter'
import { useFlowController } from '@/composables/FlowController'

const props = defineProps({
  maxListener: {
    type: Number,
    default: 1000,
  },
})

const eventEmitter = useEventEmitter()
eventEmitter.start({
  maxListener: props.maxListener,
})

const container = useContainer()
const flowController = useFlowController()

onMounted(() => {
  container.start()
})

onBeforeUnmount(() => {
  container.destroy()
  eventEmitter.getEventEmitter().removeAllListeners()
})
</script>
