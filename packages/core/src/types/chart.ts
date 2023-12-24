import { CoordOptions } from './coord'
import { ScaleOptions } from './scale'
import { AnimationOptions } from './animation'
import { Point } from './geometry'

export type ChartOptions = {
  /**
   * @description 样式
   */
  style: {
    width: number
    height: number
    padding?: [number, number, number, number]
  }
  /**
   * @description 数据
   */
  data: ChartData
  /**
   * @description 坐标系
   */
  coord?: CoordOptions
  /**
   * @description 度量
   */
  scale?: Record<string, ScaleOptions>
  /**
   * @description 动画
   */
  animation?: Record<'enter' | 'update', AnimationOptions>
  /**
   * @description 完成加载的回调
   */
  onLoad?: () => void
}

export type ChartData = DataRecord[]

// export type DataRecord = Record<string, FiledData>
export type DataRecord = { [field: string]: FieldData }

export type FieldData = string | number

export type GraphicOptions = {
  origin: Point
  width: number
  height: number
  // coord: Coordinate
}
