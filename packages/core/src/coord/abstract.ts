import { Point } from '@/types/geometry'
import { CoordinateOptions } from '@/types/coord'
import { Linear } from '@antv/scale'

export default abstract class Coordinate {
  options!: Required<CoordinateOptions>
  xRange!: [number, number]
  yRange!: [number, number]
  center!: Point
  rangeScale!: Linear
  static defaultOptions: CoordinateOptions
  constructor(options: CoordinateOptions) {
    this.update(options)
  }

  update(options: CoordinateOptions) {
    this.options = { ...Coordinate.defaultOptions, ...(this.options ?? {}), ...options }
    const { width, height, origin } = this.options
    this.rangeScale = new Linear({ domain: [origin.x, origin.x + width], range: [origin.y + height, origin.y] })
    this.center = { x: origin.x + width / 2, y: origin.y + height / 2 }
  }
  get isPolar() {
    return this.options.type === 'polar'
  }
  get isTransposed() {
    return this.options.transposed ?? false
  }

  abstract convertPoint(point: Point, flag?: boolean): Point

  abstract invertPoint(point: Point, flag?: boolean): Point

  abstract map(point: Point): Point

  abstract invert(point: Point): Point

  // abstract matrix: Array<number[]>

  protected transpose(point: Point) {
    return this.options.transposed === true
      ? { x: this.rangeScale.invert(point.y), y: this.rangeScale.map(point.x) }
      : point
  }
}
Coordinate.defaultOptions = {
  type: 'rect',
  transposed: false,
  origin: { x: 0, y: 0 },
  width: 0,
  height: 0,
  innerRadius: 0,
  radius: 1,
  startAngle: -Math.PI / 2,
  endAngle: (3 * Math.PI) / 2,
}
