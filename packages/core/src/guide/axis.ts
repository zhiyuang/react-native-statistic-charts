import merge from 'lodash-es/merge'
import { FieldData, GraphicOptions } from '@/types/chart'
import { Element, BasicShape } from '@/types/geometry'
import { AxisOptions } from '@/types/guide'
import { ScaleType } from '@/types/scale'
import { isContinuesScale } from '@/utils/scale'
import { measureText } from '@/utils/text'
import { LINE_COLOR, TEXT_COLOR } from '@/const/color'
import type { Chart } from '@/chart'
import { ComponentType } from '@/chart/component'
import type { Geometry } from '@/geometry/abstract'
import { Guide } from './abstract'
import Scale from '@/scale'
import { getAxisXLabelAlign, polarToCartesian } from '@/utils/polar'
import { Coordinate } from '@/coord/'

export class Axis extends Guide {
  animatable = false

  options!: AxisOptions
  defaultOptions: Partial<AxisOptions> = {
    double: false,
    label: true,
    grid: false,
    formatter: (value: string | number | Date) =>
      value instanceof Date ? `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}` : String(value),
    lineStyle: {
      strokeWidth: 1,
      strokeColor: LINE_COLOR,
    },
    tickLineStyle: {
      length: 5,
      strokeWidth: 1,
      strokeColor: LINE_COLOR,
    },
    gridLineStyle: {
      strokeWidth: 1,
      strokeColor: LINE_COLOR,
    },
    labelStyle: {
      fontSize: 10,
      color: TEXT_COLOR,
      offset: 2,
    },
  }

  origin?: FieldData
  axisType: 'x' | 'y' = 'x'
  field!: string
  verticalAxisField?: string

  constructor(chart: Chart, options: AxisOptions) {
    super(chart, ComponentType.Axis)
    this.update(options)
  }

  update(options: AxisOptions) {
    this.options = merge({}, this.defaultOptions, options)
    this.field = options.field
    this.origin = options.origin

    const scale = this.chart.dataSource.getField(this.field).getScale()

    if (isContinuesScale(scale) || [ScaleType.Category, ScaleType.TimeCategory].includes(scale.type)) {
      if (this.options.tickCount) scale.update({ tickCount: this.options.tickCount } as any)
    }
    if (isContinuesScale(scale)) {
      if (this.options.tickMethod) scale.update({ tickMethod: this.options.tickMethod })
    }
  }

  layout(chart: Chart): [number, number, number, number] {
    const geometry = chart
      .getComponentsByType<Geometry>(ComponentType.Geometry)
      .find(geometry => geometry.xDim === this.field || geometry.yDim === this.field)

    const scale = chart.dataSource.getField(this.field).getScale().normalization()

    if (!this.options.label || !geometry) return [0, 0, 0, 0]

    if (chart.coord.isTransposed) {
      this.axisType = this.field === geometry?.xDim ? 'y' : 'x'
      this.verticalAxisField = this.axisType === 'x' ? geometry.xDim : geometry.yDim
    } else {
      this.axisType = this.field === geometry?.xDim ? 'x' : 'y'
      this.verticalAxisField = this.axisType === 'x' ? geometry.yDim : geometry.xDim
    }

    const labels = scale.getTicks().map(tick => this.options.formatter?.(tick) ?? '')
    const labelSpace = this.options.label
      ? this.options.labelStyle!.offset! +
        Math.max(...labels.map(label => (this.axisType === 'x' ? measureText(label).height : measureText(label).width)))
      : 0
    const labelSpaceHeight = this.options.lineStyle!.strokeWidth! + this.options.tickLineStyle!.length! + labelSpace
    const labelSpaceWidth = this.options.lineStyle!.strokeWidth! + labelSpace

    // return this.axisType === 'x' ? [0, 0, labelSpace, 0] : [0, 0, 0, labelSpace]
    if (chart.coord?.isPolar) {
      return this.axisType === 'x'
        ? [labelSpaceHeight, labelSpaceWidth, labelSpaceHeight, labelSpaceWidth]
        : [0, 0, 0, 0]
    }
    return this.axisType === 'x' ? [0, 0, labelSpaceHeight, 0] : [0, 0, 0, labelSpaceWidth]
  }

  // TODO: apply transform in Chart
  graphic(chart: Chart, graphicOptions: GraphicOptions): Element[] {
    // chart.coord.update()
    const coord = chart.coord
    const xRange = coord.xRange
    const yRange = coord.yRange

    const scale = chart.dataSource
      .getField(this.field)
      ?.getScale()
      ?.position({
        range: this.axisType === 'x' ? xRange : yRange,
      })

    // calculate position in the other axix
    const verticalScale = chart.dataSource
      .getField(this.verticalAxisField!)
      ?.getScale()
      ?.position({
        range: this.axisType === 'x' ? yRange : xRange,
      })

    if (!scale || !verticalScale) return []

    const ticks = scale.getTicks() ?? []

    //TODO: chart.layoutManager.origin?
    const verticalAxis = chart
      .getComponentsByType<Axis>(ComponentType.Axis)
      .find(axis => axis.field === this.verticalAxisField)

    const axisOrigin = chart.coord.isPolar
      ? verticalScale.map(verticalAxis?.origin ?? verticalScale.invert(this.axisType === 'x' ? yRange[0] : xRange[0]))
      : chart.layoutManager.origin[this.axisType === 'x' ? 'y' : 'x']

    // TODO: double
    return [
      {
        cid: this.id,
        eid: this.id,
        shapes: [
          this.getAxisLine(graphicOptions, axisOrigin, chart.coord),
          ...this.getTicks(ticks, axisOrigin, scale, coord),
          ...(this.options.label ? this.getLabels(graphicOptions, ticks, axisOrigin, scale, coord) : []),
          ...(this.options.grid ? this.getGrids(graphicOptions, ticks, scale, coord) : []),
        ],
      },
    ]
  }

  getAxisLine = (graphicOptions: GraphicOptions, axisOrigin: number, coord: Coordinate): BasicShape => {
    const center = coord.center
    const isPolar = coord.isPolar
    const from =
      this.axisType === 'x'
        ? {
            x: graphicOptions.origin.x,
            y: axisOrigin,
          }
        : {
            x: axisOrigin,
            y: graphicOptions.origin.y + graphicOptions.height,
          }
    const to =
      this.axisType === 'x'
        ? {
            x: graphicOptions.origin.x + graphicOptions.width,
            y: axisOrigin,
          }
        : {
            x: axisOrigin,
            y: graphicOptions.origin.y,
          }

    return {
      type: 'line',
      from: isPolar ? polarToCartesian(center, from.y, from.x) : from,
      to: isPolar ? polarToCartesian(center, from.y, from.x) : to,
      ...this.options.lineStyle,
    }
  }

  getTicks = (ticks: number[], axisOrigin: number, scale: Scale, coord: Coordinate): BasicShape[] => {
    const center = coord.center
    const isPolar = coord.isPolar
    const [, r1] = coord.xRange
    return ticks.map<BasicShape>(value => {
      const from =
        this.axisType === 'x'
          ? {
              x: scale.map(value),
              y: axisOrigin,
            }
          : {
              x: axisOrigin,
              y: scale.map(value),
            }
      const to =
        this.axisType === 'x'
          ? {
              x: from.x,
              y: from.y + this.options.tickLineStyle!.length!,
            }
          : {
              x: from.x + this.options.tickLineStyle!.length!,
              y: from.y,
            }
      return {
        type: 'line',
        from: isPolar ? polarToCartesian(center, r1, from.x) : from,
        to: isPolar ? polarToCartesian(center, r1, from.x) : to,
        ...this.options.tickLineStyle,
      }
    })
  }

  getLabels = (
    graphicOptions: GraphicOptions,
    ticks: number[],
    axisOrigin: number,
    scale: Scale,
    coord: Coordinate
  ): BasicShape[] => {
    const center = coord.center
    const isPolar = coord.isPolar
    const [, r1] = coord.yRange
    return ticks.map<BasicShape>(value => {
      const pos =
        this.axisType === 'x'
          ? {
              x: scale.map(value),
              y: axisOrigin + this.options.tickLineStyle!.length! + this.options.labelStyle!.offset!,
            }
          : {
              x: axisOrigin - this.options.labelStyle!.offset!,
              y: scale.map(value),
            }
      const polarPos =
        this.axisType === 'x'
          ? {
              x: scale.map(value),
              y: r1 + this.options.tickLineStyle!.length! + this.options.labelStyle!.offset!,
            }
          : {
              x: axisOrigin,
              y: scale.map(value),
            }
      const polarAlign = this.axisType === 'x' && isPolar ? getAxisXLabelAlign(polarPos.x) : null
      let align: 'left' | 'center' | 'right' = 'right' // y axis label always aligh right
      if (this.axisType === 'x') {
        if (pos.x === graphicOptions.origin.x) {
          align = 'left'
        } else if (pos.x === graphicOptions.origin.x + graphicOptions.width) {
          align = 'right'
        } else {
          align = 'center'
        }
      }
      const verticalAlign = this.axisType === 'x' ? 'top' : 'middle'

      return {
        type: 'text',
        position: isPolar ? polarToCartesian(center, polarPos.y, polarPos.x) : pos,
        align: polarAlign?.align || align,
        verticalAlign: polarAlign?.verticalAlign || verticalAlign,
        text: [this.options.formatter?.(value) ?? ''],
        ...this.options.labelStyle,
      }
    })
  }

  getGrids = (graphicOptions: GraphicOptions, ticks: number[], scale: Scale, coord: Coordinate): BasicShape[] => {
    const center = coord.center
    const [r0, r1] = coord.yRange
    const origin = this.axisType === 'x' ? graphicOptions.origin.x : graphicOptions.origin.y + graphicOptions.height
    return ticks
      .filter(tick => scale.map(tick) !== origin)
      .map<BasicShape>(tick => {
        const polarGrid =
          this.axisType === 'x'
            ? {
                type: 'line' as const,
                from: polarToCartesian(center, r0, scale.map(tick)),
                to: polarToCartesian(center, r1, scale.map(tick)),
                ...this.options.gridLineStyle,
              }
            : {
                type: 'circle' as const,
                center: center,
                radius: scale.map(tick),
                fill: 'none',
                ...this.options.gridLineStyle,
              }

        const grid = {
          type: 'line' as const,
          from:
            this.axisType === 'x'
              ? {
                  x: scale.map(tick),
                  y: graphicOptions.origin.y + graphicOptions.height,
                }
              : {
                  x: graphicOptions.origin.x,
                  y: scale.map(tick),
                },
          to:
            this.axisType === 'x'
              ? {
                  x: scale.map(tick),
                  y: graphicOptions.origin.y,
                }
              : {
                  x: graphicOptions.origin.x + graphicOptions.width,
                  y: scale.map(tick),
                },
          ...this.options.gridLineStyle,
        }
        return coord.isPolar ? polarGrid : grid
      })
  }
}
