import { Point } from './geometry'

export interface CoordOptions {
  /**
   * @desc 坐标系类型
   * @default rect 笛卡尔坐标系
   */
  type?: 'polar' | 'rect'
  /**
   * @desc 是否发生转置
   * @default false
   */
  transposed?: boolean
  /**
   * @desc Polar 坐标系的内圆半径 0 ~ 1
   * @default 0
   */
  innerRadius?: number
  /**
   * @desc Polar 坐标系的内圆半径 0 ~ 1
   * @default 1
   */
  radius?: number
  /**
   * @desc Polar 坐标系的起始角度 in radian
   * @default -Math.PI/2
   */
  startAngle?: number
  /**
   * @desc Polar 坐标系的结束角度 in radian
   * @default 3 * Math.PI / 2
   */
  endAngle?: number
}

export interface CoordinateOptions extends CoordOptions {
  width: number
  height: number
  origin: Point
}
