import { Point } from '..'
import { polarToCartesian } from './polar'
import { isEqual, isLessThan } from './function'
import { Coordinate } from '@/coord/'

const SAFE_MIN_NUMBER = 0.00001

export const generateSVGPath = (points: Point[], seal?: boolean): string => {
  if (points.length < 2) return ''
  return points
    .map((point, index) => {
      const prefix: string = index === 0 ? 'M' : 'L'
      const postfix = index === points.length - 1 && seal ? 'Z' : ''
      return `${prefix}${point.x},${point.y}${postfix}`
    })
    .join('')
}

/**
 * 绘制环形扇区
 */
export const generateCircularPath = (coord: Coordinate, points: Point[]) => {
  if (points.length < 4) return ''
  const center = coord.center
  const [{ x: a0, y: r0 }, , { x: a1, y: r1 }] = points
  const startAngle = a0
  const endAngle = isEqual(Math.abs(a1 - a0), Math.PI * 2) ? a1 - SAFE_MIN_NUMBER : a1
  const largeArcFlag = isLessThan(Math.abs(endAngle - startAngle), Math.PI) ? 0 : 1

  // 外环圆弧起始点
  const s1 = polarToCartesian(center, r1, startAngle)
  // 外环圆弧终点
  const e1 = polarToCartesian(center, r1, endAngle)
  // 内弧起始点
  const s0 = polarToCartesian(center, r0, endAngle)
  // 内环圆弧终点
  const e0 = polarToCartesian(center, r0, startAngle)
  const arc1 = `L ${s0.x} ${s0.y} A ${r0} ${r0} 0 ${largeArcFlag} 0 ${e0.x} ${e0.y} Z`

  const arc2 = `M ${s1.x} ${s1.y} A ${r1} ${r1} 0 ${largeArcFlag} 1 ${e1.x} ${e1.y}`
  return arc2 + ' ' + arc1
}
