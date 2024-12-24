import { ref } from 'vue'
import { containerRef, flowRef } from '@/composables/references'
import { activeStyles, passiveStyles } from '@/composables/controller'

const matrix = ref({
  x: 0,
  y: 0,
  z: 1,
})

export function useFlowController() {
  let rect: DOMRect = null
  let mouseX: number = 0
  let mouseY: number = 0
  let groundCenterX: number = 0
  let groundCenterY: number = 0
  let scale: number = 0

  function getMatrix() {
    return matrix.value
  }

  function getRealValue(value: number): number {
    return value / matrix.value.z
  }

  function mouseDown(_event: MouseEvent) {
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseUp(_event: MouseEvent) {
    passiveStyles()
    containerRef.value.removeEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    activeStyles()
    matrix.value.x = event.movementX + matrix.value.x
    matrix.value.y = event.movementY + matrix.value.y
    flowTransformer(matrix.value)
  }

  function wheel(event: WheelEvent) {
    scale = event.deltaY > 0 ? 0.9 : 1.1
    rect = flowRef.value.getBoundingClientRect()

    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top

    groundCenterX = rect.width / 2
    groundCenterY = rect.height / 2

    matrix.value.x = matrix.value.x + (mouseX - groundCenterX) * (1 - scale)
    matrix.value.y = matrix.value.y + (mouseY - groundCenterY) * (1 - scale)
    matrix.value.z = matrix.value.z * scale

    flowTransformer(matrix.value)
  }

  function flowTransformer(value: typeof matrix.value) {
    flowRef.value.style.transform = `matrix(${value.z}, 0, 0, ${value.z}, ${value.x}, ${value.y})`
  }

  return {
    getMatrix,
    getRealValue,
    mouseDown,
    mouseUp,
    wheel,
  }
}
