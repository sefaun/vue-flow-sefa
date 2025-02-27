import type { Ref } from 'vue'
import { ref } from 'vue'
import { TuseEdge, TuseEdgePoint, TuseNode } from '@/composables/types'

export const nodes: Ref<Record<string, TuseNode>> = ref({})
export const edges: Ref<Record<string, TuseEdge>> = ref({})
export const points: Ref<Record<string, TuseEdgePoint>> = ref({})
