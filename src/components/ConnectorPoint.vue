<template>
  <div
    ref="pointRef"
    class="relative"
    :id="props.id"
    @mousedown.stop.left="connectorPoint.mouseDown"
    @mouseup.stop.left="connectorPoint.mouseUp"
  >
    <div :style="props.style">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType, CSSProperties } from 'vue'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { v4 } from 'uuid'
import type { TConnectorPointModes, TConnectorPointTypes } from '@/composables/types'
import { useConnectorPoint } from '@/composables/ConnectorPoint'

const props = defineProps({
  id: {
    type: String,
    default: v4(),
    required: false,
  },
  type: {
    type: String as PropType<TConnectorPointTypes>,
    required: true,
  },
  mode: {
    type: String as PropType<TConnectorPointModes>,
    default: 'free',
    required: false,
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: {
      width: '20px',
      height: '20px',
      border: '1px solid black',
      backgroundColor: 'white',
      borderRadius: '50%',
    },
  },
})

const pointRef = ref()
const connectorPoint = useConnectorPoint({
  id: props.id,
  type: props.type,
  mode: props.mode,
})

onMounted(() => {
  connectorPoint.setConnectorPointElement(pointRef.value)
  connectorPoint.start()
})

onBeforeUnmount(() => {
  connectorPoint.destroy()
})
</script>
