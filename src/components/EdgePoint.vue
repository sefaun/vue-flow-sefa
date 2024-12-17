<template>
  <div
    ref="pointRef"
    class="relative"
    :id="id"
    @mousedown.stop.left="edgePoint.mouseDown"
    @mouseup.stop.left="edgePoint.mouseUp"
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
import { points } from '@/composables/states'
import { useEdgePoint } from '@/composables/EdgePoint'
import type { TEdgePointTypeValues } from '@/composables/types'

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
  type: {
    type: String as PropType<TEdgePointTypeValues>,
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

const id = ref(props.id || v4())
const pointRef = ref()
const edgePoint = useEdgePoint({
  id: id.value,
  type: props.type,
  incomingConnection: props.incomingConnection,
  outgoingConnection: props.outgoingConnection,
})

onMounted(() => {
  edgePoint.setEdgePointElement(pointRef.value)
  points.value[id.value] = pointRef.value
})

onBeforeUnmount(() => {
  delete points.value[id.value]
})
</script>
