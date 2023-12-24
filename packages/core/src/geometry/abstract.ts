import isEqual from 'lodash-es/isEqual'
import { AestheticConfigObject, GeometryOptions, Point } from '@/types/geometry'
import { DataRecord } from '@/types/chart'
import type { Chart } from '@/chart'
import { uniqueFilter } from '@/utils/data'
import { ChartComponent, ComponentType } from '@/chart/component'
import { Aesthetic } from './aesthetic'
import { Axis } from '@/guide/axis'
import { DataSource } from '@/chart/data'

export abstract class Geometry extends ChartComponent {
  constructor(chart: Chart) {
    super(chart, ComponentType.Geometry)
  }

  update(options: GeometryOptions) {
    const [xDim, yDim] = options.position?.split('*') ?? []
    this.xDim = xDim
    this.yDim = yDim

    const dataSource = this.chart.dataSource

    if (!isEqual(dataSource, this.dataSource) || !isEqual(this.options?.groupBy, options.groupBy)) {
      this.groupedData = this.groupData(dataSource.getData(), options.groupBy)
    }

    if (!isEqual(dataSource, this.dataSource)) {
      this.dataSource = dataSource
    }

    if (!isEqual(options.adjust, this.options?.adjust)) {
      const adjustType = typeof options.adjust === 'object' ? options.adjust?.type : options.adjust
      if (adjustType === 'stack') {
        this.recomputeDomainforStack()
      } else {
        const yField = this.chart.dataSource.getField(this.yDim)
        const yData = yField.getData().map(Number)
        yField.getScale().update({
          domain: [Math.min(...yData), Math.max(...yData)],
        })
      }
    }
  }

  abstract type: string
  abstract options: GeometryOptions

  xDim!: string
  yDim!: string
  groupedData!: DataRecord[][]
  dataSource!: DataSource

  abstract defaultAestheticOptions: Record<'size' | 'color', AestheticConfigObject<unknown>>

  groupData(data: DataRecord[], groupDim?: string): DataRecord[][] {
    return groupDim
      ? data
          .map(record => record[groupDim])
          .filter(uniqueFilter)
          .map(value => data.filter(record => record[groupDim] === value))
      : [data]
  }

  checkAndUpdateGroupedData(chart: Chart) {
    const dataSource = chart.dataSource
    if (!isEqual(dataSource, this.dataSource)) {
      this.groupedData = this.groupData(dataSource.getData(), this.options?.groupBy)
      this.dataSource = dataSource
    }
  }

  recomputeDomainforStack() {
    const stacked: { positive: number; negative: number }[] = []
    this.groupedData.forEach(group => {
      group.forEach((record, index) => {
        if (!stacked[index]) stacked[index] = { positive: 0, negative: 0 }
        if (record[this.yDim] > 0) {
          stacked[index].positive += Number(record[this.yDim])
        } else {
          stacked[index].negative += Number(record[this.yDim])
        }
      })
    })

    const minValue = Math.min(...stacked.map(o => o.negative))
    const maxValue = Math.max(...stacked.map(o => o.positive))

    this.chart.dataSource
      .getField(this.yDim)
      .getScale()
      .update({
        domain: [minValue, maxValue],
      })
  }

  getAxisOrigin(chart: Chart) {
    const xScale = chart.dataSource
      .getField(this.xDim)
      .getScale()
      .position({ range: [0, 1] })
    const yScale = chart.dataSource
      .getField(this.yDim)
      .getScale()
      .position({ range: [0, 1] })
    const xAxis = chart.getComponentsByType<Axis>(ComponentType.Axis).find(axis => axis.field === this.xDim)
    const yAxis = chart.getComponentsByType<Axis>(ComponentType.Axis).find(axis => axis.field === this.yDim)
    const xAxisOrigin = xAxis?.origin ?? xScale.invert(0)
    const yAxisOrigin = yAxis?.origin ?? yScale.invert(0)

    return { x: xAxisOrigin, y: yAxisOrigin }
  }

  generatePositionData(
    chart: Chart,
    aesthetic: Aesthetic,
    opt?: { xCentered?: boolean; width?: number }
  ): { points: Point[]; record: DataRecord }[][] {
    this.checkAndUpdateGroupedData(chart)

    const { x: xAxisOrigin, y: yAxisOrigin } = this.getAxisOrigin(chart)

    const stackedData: { positive: number; negative: number }[] = []

    const origin = aesthetic.position({
      [this.xDim]: xAxisOrigin,
      [this.yDim]: Math.max(0, yAxisOrigin),
    })

    const adjustType = typeof this.options.adjust === 'object' ? this.options.adjust?.type : this.options.adjust
    const marginRatio = typeof this.options.adjust === 'object' ? this.options.adjust.marginRatio : 0
    const width = opt?.width ?? (aesthetic.size as () => number)()
    const result = this.groupedData.map((group, groupIndex, arr) => {
      return group
        .sort((recordA, recordB) => {
          const scale = chart.dataSource.getField(this.xDim).getScale()
          return scale.map(recordA[this.xDim]) - scale.map(recordB[this.xDim])
        })
        .map((record, index) => {
          const data = aesthetic.position(record)

          const points = [
            { x: data.x, y: origin.y },
            { x: data.x, y: data.y },
          ]
          if (opt?.xCentered) {
            points[0].x -= width / 2
            points[1].x -= width / 2
          }
          if (adjustType === 'stack') {
            if (!stackedData[index]) {
              stackedData[index] = { positive: origin.y, negative: origin.y }
            }
            if (record[this.yDim] > 0) {
              points[0].y = stackedData[index].positive
              points[1].y = stackedData[index].positive + data.y - origin.y
              stackedData[index].positive += data.y - origin.y
            } else {
              points[0].y = stackedData[index].negative
              points[1].y = stackedData[index].negative + data.y - origin.y
              stackedData[index].negative += data.y - origin.y
            }
          } else if (adjustType === 'dodge') {
            // N 个柱状图时有 N-1 个空隙
            points[0].x +=
              width / 2 + (width + marginRatio) * groupIndex - (arr.length * width + (arr.length - 1) * marginRatio) / 2
            points[1].x +=
              width / 2 + (width + marginRatio) * groupIndex - (arr.length * width + (arr.length - 1) * marginRatio) / 2
          }
          return { points, record }
        })
    })

    return result
  }
}
