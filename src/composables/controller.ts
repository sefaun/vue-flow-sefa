import { containerRef } from '@/composables/references'

export function activeStyles() {
  containerRef.value.style.cursor = 'grabbing'
}

export function passiveStyles() {
  containerRef.value.style.cursor = 'grab'
}
