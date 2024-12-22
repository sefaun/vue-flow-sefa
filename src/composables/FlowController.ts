import { reactive } from 'vue'
import { containerRef, flowRef } from '@/composables/references'
import { activeStyles, passiveStyles } from '@/composables/controller'

const matrix = reactive({
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

  function mouseDown(_event: MouseEvent) {
    containerRef.value.addEventListener('mousemove', mouseMove)
  }

  function mouseUp(_event: MouseEvent) {
    passiveStyles()
    containerRef.value.removeEventListener('mousemove', mouseMove)
  }

  function mouseMove(event: MouseEvent) {
    activeStyles()
    matrix.x = event.movementX + matrix.x
    matrix.y = event.movementY + matrix.y
    flowTransformer(matrix)
  }

  function wheel(event: WheelEvent) {
    scale = event.deltaY > 0 ? 0.9 : 1.1
    rect = flowRef.value.getBoundingClientRect()

    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top

    groundCenterX = rect.width / 2
    groundCenterY = rect.height / 2

    matrix.x = matrix.x + (mouseX - groundCenterX) * (1 - scale)
    matrix.y = matrix.y + (mouseY - groundCenterY) * (1 - scale)
    matrix.z = matrix.z * scale

    flowTransformer(matrix)
  }

  function flowTransformer(value: typeof matrix) {
    flowRef.value.style.transform = `matrix(${value.z}, 0, 0, ${value.z}, ${value.x}, ${value.y})`
  }

  function getRealValue(value: number): number {
    return value / matrix.z
  }

  return {
    getRealValue,
    mouseDown,
    mouseUp,
    wheel,
  }
}
