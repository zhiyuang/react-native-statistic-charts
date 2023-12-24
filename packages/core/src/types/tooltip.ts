import { DataRecord, FieldData } from './chart'
import { LineStyle, TextStyle, Point, Circle } from './geometry'

export interface TooltipParams {
  origin: Point
  data: Array<{
    field: string
    value: FieldData
    record: DataRecord
    origin: Point
  }>
}

export interface TooltipOptions {
  /**
   * @description 是否吸附到数据点
   * @default true
   */
  sticky?: boolean
  /**
   * @description 是否显示所有选中的数据点
   * @default true
   */
  shared?: boolean
  /**
   * @description 是否显示标签
   * @default true
   */
  label?: boolean
  /**
   * @description 是否显示辅助线
   * @default false
   */
  crosshair?: boolean
  /**
   * @description 是否显示交叉点
   * @default true
   */
  tooltipMarker?: boolean
  /**
   * @description 辅助线类型
   * @default 'xy'
   */
  crosshairsType?: 'x' | 'y' | 'xy'
  /**
   * @description 辅助线样式
   * @default { strokeWidth: 1, strokeColor: '#DFDFDF', strokeStyle: 'dashed' }
   */
  crosshairStyle?: LineStyle
  /**
   * @description 交叉点样式
   * @default { radius: 4, strokeColor: '#fff', strokeWidth: 1, fill: 'orange', }
   */
  tooltipMarkerStyle?: Omit<Circle, 'type' | 'center'>
  /**
   * @description 标签容器样式
   * @default { backgroundColor: '#202020', padding: [2, 4, 2, 4] }
   */
  containerStyle?: {
    backgroundColor?: string
    padding?: [number, number, number, number]
  }
  /**
   * @description 标签文字样式
   * @default { color: '#fff', fontSize: 12, lineHeight: 1.2, }
   */
  textStyle?: TextStyle
  /**
   * @description 自定义标签文字格式化方法
   * @default (field, value) => `${field}: ${value}`
   */
  formatter?: (field: string, value: string | number, record: DataRecord) => string
  /**
   * @description Tooltip 隐藏时的回调函数
   */
  onHide?: () => void
  /**
   * @description Tooltip 显示时的回调函数
   */
  onShow?: (params: TooltipParams) => void
  /**
   * @description Tooltip 内容改变时的回调函数
   */
  onChange?: (params: TooltipParams) => void
}
