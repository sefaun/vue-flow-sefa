import { useFlow } from '@/composables/Flow'
import { edgePointType, planes } from '@/composables/enums'
import type { TEdgePointTypeValues } from '@/composables/types'

export function useEdgeDimension() {
  const flow = useFlow()
  let bezierCurveD = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    x4: 0,
    y4: 0,
  }

  function bezierCurve(type: TEdgePointTypeValues, data: { x1: number; y1: number; x2: number; y2: number }) {
    bezierCurveD = {
      x1: data.x1,
      y1: data.y1,
      x2: 0,
      y2: 0,
      x3: 0,
      y3: 0,
      x4: data.x2,
      y4: data.y2,
    }

    if (flow.getFlowOptions().plane == planes.horizontal) {
      bezierCurveD.y2 = data.y1
      bezierCurveD.y3 = data.y2

      if (type == edgePointType.input) {
        bezierCurveD.x2 = data.x1 - 200
        bezierCurveD.x3 = data.x2 + 200
      } else {
        bezierCurveD.x2 = data.x1 + 200
        bezierCurveD.x3 = data.x2 - 200
      }
    } else {
      bezierCurveD.x2 = data.x1
      bezierCurveD.x3 = data.x2

      if (type == edgePointType.input) {
        bezierCurveD.y2 = data.y1 - 200
        bezierCurveD.y3 = data.y2 + 200
      } else {
        bezierCurveD.y2 = data.y1 + 200
        bezierCurveD.y3 = data.y2 - 200
      }
    }

    return `M ${bezierCurveD.x1},${bezierCurveD.y1} C ${bezierCurveD.x2},${bezierCurveD.y2} ${bezierCurveD.x3},${bezierCurveD.y3} ${bezierCurveD.x4},${bezierCurveD.y4}`
  }

  return {
    bezierCurve,
  }
}
