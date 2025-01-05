import { ref } from 'vue'
import { containerRef, flowRef } from '@/composables/references'
import { activeStyles, passiveStyles } from '@/composables/controller'

const matrix = ref({
  x: 0,
  y: 0,
  z: 1,
})

export function useFlowController() {
  const zoomLimits = {
    min: 0.2,
    max: 2.5,
  } as const

  function getMatrix() {
    return matrix.value
  }

  function getRealValue(value: number): number {
    return value / matrix.value.z
  }

  function getCorrectZoom(value: number): number {
    if (value > zoomLimits.max) {
      return zoomLimits.max
    }

    if (value < zoomLimits.min) {
      return zoomLimits.min
    }

    return value
  }

  function setMatrix(value: Partial<typeof matrix.value>) {
    if (value.hasOwnProperty('z')) {
      value.z = Number(value.z.toFixed(2))
    }

    matrix.value = Object.assign(matrix.value, value)
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
    const { x, y } = getMatrix()
    setMatrix({
      x: event.movementX + x,
      y: event.movementY + y,
    })
    renderMatrix(matrix.value)
  }

  function centerZoom(deltaY: number, centerX: number, centerY: number) {
    const scale = deltaY > 0 ? 0.9 : 1.1
    const flow = flowRef.value.getBoundingClientRect()

    const mouseX = centerX - flow.left
    const mouseY = centerY - flow.top

    const groundCenterX = flow.width / 2
    const groundCenterY = flow.height / 2

    return {
      scale,
      groundCenterX: mouseX - groundCenterX,
      groundCenterY: mouseY - groundCenterY,
    }
  }

  function wheel(event: WheelEvent) {
    const { scale, groundCenterX, groundCenterY } = centerZoom(event.deltaY, event.clientX, event.clientY)
    const { x, y, z } = getMatrix()

    setMatrix({
      x: x + groundCenterX * (1 - scale),
      y: y + groundCenterY * (1 - scale),
      z: z * scale,
    })
    renderMatrix(matrix.value)
  }

  function renderMatrix(value: typeof matrix.value) {
    flowRef.value.style.transform = `matrix(${value.z}, 0, 0, ${value.z}, ${value.x}, ${value.y})`
  }

  return {
    getCorrectZoom,
    getMatrix,
    getRealValue,
    centerZoom,
    setMatrix,
    renderMatrix,
    mouseDown,
    mouseUp,
    wheel,
  }
}
