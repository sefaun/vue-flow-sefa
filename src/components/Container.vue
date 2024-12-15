<template>
  <div ref="containerRef" class="relative">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { containerRef } from '@/composables/index'
import { useContainer } from '@/composables/Container'
import { useEventEmitter } from '@/composables/EventEmitter'

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

onMounted(() => {
  container.start()
})

onBeforeUnmount(() => {
  container.destroy()
  eventEmitter.getEventEmitter().removeAllListeners()
})
</script>
