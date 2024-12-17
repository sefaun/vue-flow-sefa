import type { Ref } from 'vue'
import { ref } from 'vue'
import { TuseNode } from '@/composables/types'

export const nodes: Ref<Record<string, TuseNode>> = ref({})
export const points: Ref<Record<string, HTMLDivElement>> = ref({})
