import { useFlow } from '@/composables/Flow'
import { edgePointType, planes } from '@/composables/enums'
import type { TEdgePointTypeValues } from '@/composables/types'

export function useEdgeDimension() {
  const flow = useFlow()
  let straightLinesDComplex = false
  const straightLinePointsDifference = 80
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
  let straightLinesD = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    x4: 0,
    y4: 0,
    x5: 0,
    y5: 0,
    x6: 0,
    y6: 0,
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
      bezierCurveD.x2 = data.x1 + (type == edgePointType.input ? -200 : 200)
      bezierCurveD.x3 = data.x2 + (type == edgePointType.input ? 200 : -200)
    } else {
      bezierCurveD.x2 = data.x1
      bezierCurveD.x3 = data.x2
      bezierCurveD.y2 = data.y1 + (type == edgePointType.input ? -200 : 200)
      bezierCurveD.y3 = data.y2 + (type == edgePointType.input ? 200 : -200)
    }

    return `M ${bezierCurveD.x1},${bezierCurveD.y1} C ${bezierCurveD.x2},${bezierCurveD.y2} ${bezierCurveD.x3},${bezierCurveD.y3} ${bezierCurveD.x4},${bezierCurveD.y4}`
  }

  function straightLines(type: TEdgePointTypeValues, data: { x1: number; y1: number; x2: number; y2: number }) {
    straightLinesDComplex =
      (flow.getFlowOptions().plane == planes.horizontal && data.x2 - data.x1 < straightLinePointsDifference) ||
      (flow.getFlowOptions().plane == planes.vertical && data.y2 - data.y1 < straightLinePointsDifference)

    straightLinesD.x1 = data.x1
    straightLinesD.y1 = data.y1
    straightLinesD.x6 = data.x2
    straightLinesD.y6 = data.y2

    if (!straightLinesDComplex) {
      straightLinesD.x4 = data.x2
      straightLinesD.y4 = data.y2

      if (flow.getFlowOptions().plane == planes.horizontal) {
        straightLinesD.x2 = (data.x2 - data.x1) / 2 + data.x1
        straightLinesD.y2 = data.y1
        straightLinesD.x3 = straightLinesD.x2
        straightLinesD.y3 = data.y2
      } else {
        straightLinesD.x2 = data.x1
        straightLinesD.y2 = (data.y2 - data.y1) / 2 + data.y1
        straightLinesD.x3 = data.x2
        straightLinesD.y3 = straightLinesD.y2
      }
    } else {
      if (flow.getFlowOptions().plane == planes.horizontal) {
        if (type == edgePointType.input) {
          //
        } else {
          straightLinesD.x2 = data.x1 + straightLinePointsDifference / 2
          straightLinesD.y2 = data.y1
          straightLinesD.x3 = straightLinesD.x2
          straightLinesD.y3 = (data.y2 - data.y1) / 2 + data.y1
          straightLinesD.x4 = straightLinesD.x6 - straightLinePointsDifference / 2
          straightLinesD.y4 = straightLinesD.y3
          straightLinesD.x5 = straightLinesD.x4
          straightLinesD.y5 = data.y2
        }
      } else {
        if (type == edgePointType.input) {
          //
        } else {
          straightLinesD.x2 = data.x1
          straightLinesD.y2 = data.y1 + straightLinePointsDifference / 2
          straightLinesD.x3 = (data.x2 - data.x1) / 2 + data.x1
          straightLinesD.y3 = straightLinesD.y2
          straightLinesD.x4 = straightLinesD.x3
          straightLinesD.y4 = straightLinesD.y6 - straightLinePointsDifference / 2
          straightLinesD.x5 = data.x2
          straightLinesD.y5 = straightLinesD.y4
        }
      }
    }

    if (straightLinesDComplex) {
      return `M ${straightLinesD.x1},${straightLinesD.y1}
        L${straightLinesD.x2},${straightLinesD.y2}
        L${straightLinesD.x3},${straightLinesD.y3}
        L${straightLinesD.x4},${straightLinesD.y4}
        L${straightLinesD.x5},${straightLinesD.y5}
        L${straightLinesD.x6},${straightLinesD.y6}`
    }

    return `M ${straightLinesD.x1},${straightLinesD.y1} L${straightLinesD.x2},${straightLinesD.y2} L${straightLinesD.x3},${straightLinesD.y3} L${straightLinesD.x4},${straightLinesD.y4}`
  }

  return {
    bezierCurve,
    straightLines,
  }
}
