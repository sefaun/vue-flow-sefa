<template>
  <path
    ref="connectorRef"
    class="fill-none stroke-[4] stroke-[green] hover:stroke-[6] hover:cursor-pointer pointer-events-auto"
    stroke-dasharray="15,5"
    marker-end="url(#thinker-arrow-end)"
    :id="props.data.id"
    :d="dimension"
    @click.stop.left="connector.click"
  ></path>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useConnector } from '@/composables/Connector'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: {},
    required: true,
  },
})

const connectorRef = ref()
const connector = useConnector(props.data)

const dimension = computed(() => 'M 0,25 C 30,40 50,60 160,170')

onMounted(() => {
  connector.setConnectorElement(connectorRef.value)
  connector.start()
})

onBeforeUnmount(() => {
  connector.destroy()
})
</script>
