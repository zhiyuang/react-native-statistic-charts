import Coordinate from './abstract'
import { CoordinateOptions, Point } from '@/types/'
import { Linear } from '@antv/scale'
import { polarToCartesian, cartesianToPolar } from '@/utils/polar'

export default class Polar extends Coordinate {
  radiusScale!: Linear
  angleScale!: Linear
  center!: Point
  constructor(options: CoordinateOptions) {
    super(options)
    this.update(options)
  }
  update(options: CoordinateOptions) {
    super.update(options)
    const { width, height, origin } = this.options
    // max radius
    const radius = Math.min(width, height) / 2
    // angle range
    this.xRange = [this.options.startAngle, this.options.endAngle]
    // radius range
    this.yRange = [radius * this.options.innerRadius, radius * this.options.radius]
    // y scale for transform cartesian to polar
    this.radiusScale = new Linear({
      domain: [origin.y + height, origin.y],
      range: this.yRange,
    })
    // x scale for transform cartesian to polar
    this.angleScale = new Linear({
      domain: [origin.x, origin.x + width],
      range: this.xRange,
    })
  }

  map(point: Point) {
    return {
      x: this.angleScale.map(point.x),
      y: this.radiusScale.map(point.y),
    }
  }

  invert(point: Point) {
    return {
      x: this.angleScale.invert(point.x),
      y: this.radiusScale.invert(point.y),
    }
  }

  // TODO: not implemented
  convertPoint(_point: Point, flag = true) {
    const point = this.map(this.transpose(_point))
    return flag ? polarToCartesian(this.center, point.y, point.x) : point
  }

  // TODO: not implemented
  invertPoint(_point: Point, flag = true) {
    const point = flag ? cartesianToPolar(this.center, _point.x, _point.y) : _point
    return this.transpose(this.invert(point))
  }
}
