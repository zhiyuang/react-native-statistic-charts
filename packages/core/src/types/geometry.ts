import type { Matrix } from 'transformation-matrix'
import { InteractionEvent } from '@/types/interaction'
import { DataRecord } from './chart'
import { InteractionState } from './interaction'
import { AnimationOptions } from './animation'

//绘制元素的包围盒子，左上角作为原点
export interface BBox {
  origin: Point
  width: number
  height: number
}

export interface Element {
  cid: string
  eid: string
  shapes: BasicShape[]
  bbox?: BBox
  state?: Partial<Record<Exclude<InteractionState, 'default'>, BasicShape[]>>
  record?: DataRecord
  interaction?: Interaction
  animating?: boolean
  animateOptions?: AnimationOptions
  prevShapes?: BasicShape[]
}

export interface Interaction {
  bound: number[] | ((point: Point) => boolean)
  origin: Point
}

export interface DynamicElement extends Element {
  dynamicShapes: (interaction: InteractionEvent) => BasicShape[]
}

export type BasicShape = Rect | Circle | Line | Polyline | Polygon | Path | Text

export type LineStyle = {
  strokeWidth?: number
  strokeColor?: string
  strokeStyle?: 'solid' | 'dashed'
  dashedStyle?: number[]
}

export type FillStyle = {
  fill?: string
  fillOpacity?: number
}

export type BorderStyle = {
  borderWidth?: number
  borderColor?: string
}

export type TextStyle = {
  align?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  color?: string
  // font?: string
  fontSize?: number
  fontWeight?: string
  lineHeight?: number
}

interface Shape extends LineStyle, FillStyle {
  type: string
  transform?: Matrix
  points?: Point[]
}

export interface Rect extends Shape {
  type: 'rect'
  origin: Point
  width: number
  height: number
  radius?: number
}

export interface Circle extends Shape {
  type: 'circle'
  center: Point
  radius: number
}

export interface Line extends Shape {
  type: 'line'
  from: Point
  to: Point
}

export interface Polyline extends Shape {
  type: 'polyline'
  points: Point[]
}

export interface Polygon extends Shape {
  type: 'polygon'
  points: Point[]
}

export interface Path extends Shape {
  type: 'path'
  d: string
}

export interface Text extends Shape, TextStyle {
  type: 'text'
  position: Point
  text: string[]
}

export interface Image extends Shape {
  type: 'image'
  position: Point
  src: string
  width?: number
  height?: number
}

export type Point = {
  x: number
  y: number
}

export type Dimension = string

export type DirectValue<T> = T | T[]

export type AestheticFunction<T> = (value: DataRecord) => T

export type AestheticConfigObject<T> = {
  field?: Dimension
  value?: DirectValue<T> | AestheticFunction<T>
}

export type AestheticAttrs = 'position' | 'size' | 'shape' | 'color' | 'label'

export interface AestheticOptions {
  /**
   * @description 位置映射
   */
  position?: Dimension
  /**
   * @description 尺寸映射
   */
  size?: Dimension | DirectValue<number> | AestheticConfigObject<number>
  /**
   * @description 形状映射
   */
  shape?: Dimension
  /**
   * @description 颜色映射
   */
  color?: Dimension | DirectValue<string> | AestheticConfigObject<string>
  /**
   * @description 标签映射
   */
  label?: Dimension
}

export type AdjustOption = {
  type: 'stack' | 'dodge'
  /**
   * @description 设置分组间柱子的间距
   */
  marginRatio: number
}

export interface GeometryOptions extends AestheticOptions {
  /**
   * @description 指定分组维度
   */
  groupBy?: string
  /**
   * @description 位置调整方式
   */
  adjust?: AdjustOption | 'stack' | 'dodge'
}

// export interface PointOptions extends GeometryOptions {
//   style?: LineStyle
// }
export type PointOptions = GeometryOptions

export type LineOptions = GeometryOptions

export interface AreaOptions extends GeometryOptions {
  style?: FillStyle
}

export interface IntervalOptions extends GeometryOptions {
  itemStyle?: BorderStyle
  barHeight?: (record: DataRecord) => number | undefined
}
