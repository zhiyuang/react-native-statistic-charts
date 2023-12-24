import Coordinate from './abstract'
import { CoordinateOptions, Point } from '@/types/'

export default class Cartesian extends Coordinate {
  constructor(options: CoordinateOptions) {
    super(options)
  }

  update(options: CoordinateOptions): void {
    super.update(options)
    const { width, height, origin } = this.options
    this.xRange = [origin.x, origin.x + width]
    this.yRange = [origin.y + height, origin.y]
  }
  // TODO: not implemented
  convertPoint(_point: Point) {
    const point = this.transpose(_point)
    return point
  }

  // TODO: not implemented
  invertPoint(_point: Point) {
    const point = this.transpose(_point)
    return point
  }

  map(point: Point): Point {
    return point
  }

  invert(point: Point): Point {
    return point
  }
}
