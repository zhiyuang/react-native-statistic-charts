import { TickMethod } from '@antv/scale'
import { DataRecord, FieldData, GraphicOptions } from './chart'
import { FillStyle, LineStyle, Point, TextStyle } from './geometry'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GuideOptions {}

export interface AxisOptions extends GuideOptions {
  /**
   * @description 数据字段
   */
  field: string
  /**
   * @description 是否显示两侧坐标轴
   * @default false
   */
  double?: boolean
  /**
   * @description 是否展示标签
   * @default true
   */
  label?: boolean
  /**
   * @description 是否展示网格
   * @default false
   */
  grid?: boolean
  /**
   * @description 自定义坐标轴原点（数据值），决定另一坐标轴在此维度上的位置
   */
  origin?: FieldData
  /**
   * @description 刻度数量
   */
  tickCount?: number
  /**
   * @description 自定义刻度函数
   */
  tickMethod?: TickMethod<number | Date>
  /**
   * @description 自定义刻度标签文字格式化方法
   */
  formatter?: (value: string | number | Date) => string
  /**
   * @description 坐标轴线样式
   * @default { strokeWidth: 1, strokeColor: '#DFDFDF' }
   */
  lineStyle?: LineStyle
  /**
   * @description 坐标轴刻度样式
   * @default { length: 5, strokeWidth: 1, strokeColor: '#DFDFDF' }
   */
  tickLineStyle?: LineStyle & {
    length?: number
  }
  /**
   * @description 坐标轴网格样式
   * @default { strokeWidth: 1, strokeColor: '#DFDFDF' }
   */
  gridLineStyle?: LineStyle
  /**
   * @description 坐标轴标签样式
   * @default { fontSize: 10, color: '#565656', offset: 2 }
   */
  labelStyle?: TextStyle & {
    offset?: number
  }
}

export enum KeywordPosition {
  Min = 'KEYWORD_POS_MIN',
  Max = 'KEYWORD_POS_MAX',
  Median = 'KEYWORD_POS_MEDIAN',
}

export interface GuideLineOptions extends GuideOptions {
  /**
   * @description 标注线起点（数据点）
   */
  start: DataRecord
  /**
   * @description 标注线终点（数据点）
   */
  end: DataRecord
  /**
   * @description 标注线样式
   */
  style?: LineStyle
}

export interface GuidePointOptions extends GuideOptions {
  /**
   * @description 标注点位置（数据点）
   */
  position: DataRecord
  /**
   * @description 标注点大小
   */
  size?: number
  /**
   * @description 标注点样式，包括描边样式和填充样式
   */
  style?: LineStyle & FillStyle
}

export enum PlacementPosition {
  Top = 1,
  Left,
  Right,
  Bottom,
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
  LeftTop,
  LeftBottom,
  RightTop,
  RightBottom,
}

export interface GuideLabelOptions extends GuideOptions {
  /**
   * @description 标注点位置（数据点）
   */
  position: DataRecord
  /**
   * @description 标注点样式，包括描边样式和填充样式
   */
  labelStyle?: LineStyle &
    FillStyle & {
      padding?: [number, number, number, number]
      offset?: number
      rect?: { width?: number; height?: number; radius?: number }
      arrow?: { base: number; height: number }
    }
  /**
   * 标注点相对与原点的位置
   */
  placement?: PlacementPosition | ((pos: Point, graphicOptions: GraphicOptions) => PlacementPosition)
  /**
   * 标签文本格式化，默认 yDim
   */
  formatter: (value: DataRecord) => string | string[]

  /**
   * @description 标签文本样式
   * @default { fontSize: 10, color: '#565656', offset: 2 }
   */
  textStyle?: TextStyle & {
    offset?: number
  }
}
