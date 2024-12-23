<template>
  <div
    ref="pointRef"
    class="relative"
    :id="id"
    @mousedown.stop.left="edgePoint.mouseDown"
    @mouseup.stop.left="edgePoint.mouseUp"
  >
    <div v-if="hasSlot">
      <slot></slot>
    </div>
    <div v-else :style="props.style"></div>
  </div>
</template>

<script setup lang="ts">
import type { PropType, CSSProperties } from 'vue'
import { onMounted, onBeforeUnmount, ref, inject, useSlots, computed } from 'vue'
import { points } from '@/composables/store'
import { useEdgePoint } from '@/composables/EdgePoint'
import type { TEdgePointTypeValues } from '@/composables/types'
import { NodeId } from '@/context/index'

const slots = useSlots()

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
  incomingConnectionLimit: {
    type: Number,
    default: -1,
    required: false,
  },
  outgoingConnectionLimit: {
    type: Number,
    default: -1,
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
      cursor: 'crosshair',
    },
  },
})

const hasSlot = computed(() => !!slots.default)

const nodeId = inject(NodeId)
const id = ref(props.id || crypto.randomUUID())
const pointRef = ref()
const edgePoint = useEdgePoint({
  id: id.value,
  nodeId,
  type: props.type,
  incomingConnection: props.incomingConnection,
  outgoingConnection: props.outgoingConnection,
  incomingConnectionLimit: props.incomingConnectionLimit,
  outgoingConnectionLimit: props.outgoingConnectionLimit,
})

onMounted(() => {
  edgePoint.setEdgePointElement(pointRef.value)
  points.value[id.value] = pointRef.value
})

onBeforeUnmount(() => {
  delete points.value[id.value]
})
</script>
