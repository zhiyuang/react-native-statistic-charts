import { Point } from '@/types/geometry'

/**
 * @antv/coord
 * 将极坐标的点转换成笛卡尔坐标系上的点
 * @param center
 * @param radius
 * @param angle
 */
export const polarToCartesian = (center: Point, radius: number, angle: number) => {
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  }
}

/**
 * @antv/coord
 * 将笛卡尔坐标系上的点转换成极坐标
 * @param center
 * @param x
 * @param y
 */
export const cartesianToPolar = (center: Point, y: number, x: number) => {
  const dx = x - center.x
  const dy = y - center.y
  return {
    y: Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
    x: Math.atan2(dy, dx),
  }
}

const inRange = (range: [number, number], target: number) => {
  return range[0] < target && target < range[1]
}

export const getAxisXLabelAlign = (
  radian: number
): { align: 'left' | 'center' | 'right' | undefined; verticalAlign: 'bottom' | 'middle' | 'top' | undefined } => {
  if (radian === -Math.PI / 2) {
    return { align: 'center', verticalAlign: 'bottom' }
  } else if (inRange([-Math.PI / 2, 0], radian)) {
    return { align: 'left', verticalAlign: 'bottom' }
  } else if (radian === 0) {
    return { align: 'left', verticalAlign: 'middle' }
  } else if (inRange([0, Math.PI / 2], radian)) {
    return { align: 'left', verticalAlign: 'top' }
  } else if (radian === Math.PI / 2) {
    return { align: 'center', verticalAlign: 'top' }
  } else if (inRange([Math.PI / 2, Math.PI], radian)) {
    return { align: 'right', verticalAlign: 'top' }
  } else if (radian === Math.PI) {
    return { align: 'right', verticalAlign: 'middle' }
  } else {
    return { align: 'right', verticalAlign: 'bottom' }
  }
}
