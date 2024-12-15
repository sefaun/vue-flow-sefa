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
import { useConnectorPoint } from '@/composables/ConnectorPoint'
import type { TConnectorPointTypeValues } from '@/composables/types'

const props = defineProps({
  id: {
    type: String,
    default: v4(),
    required: false,
  },
  type: {
    type: String as PropType<TConnectorPointTypeValues>,
    required: true,
  },
  incomingConnection: {
    type: Boolean,
    default: true,
    required: false,
  },
  outgoingConnection: {
    type: Boolean,
    default: true,
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
  incomingConnection: props.incomingConnection,
  outgoingConnection: props.outgoingConnection,
})

onMounted(() => {
  connectorPoint.setConnectorPointElement(pointRef.value)
  connectorPoint.start()
})

onBeforeUnmount(() => {
  connectorPoint.destroy()
})
</script>
