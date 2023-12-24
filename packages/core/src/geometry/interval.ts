import { DataRecord, GraphicOptions } from '@/types/chart'
import { Element, Interaction, IntervalOptions, Path, Point } from '@/types/geometry'
import { generateSVGPath, generateCircularPath } from '@/utils/svg'
import { DEFAULT_COLORS } from '@/const/color'
import { Chart } from '@/chart'
import { Geometry } from './abstract'
import { Aesthetic } from './aesthetic'
import { Coordinate } from '@/coord/'
import { uniqueFilter } from '@/utils/data'
import isObject from 'lodash/isObject'

export class Interval extends Geometry {
  type = 'Interval'
  options!: IntervalOptions
  animatable = true

  defaultAestheticOptions = {
    position: {},
    shape: {},
    size: { value: [10, 10] },
    color: { value: DEFAULT_COLORS },
    label: {},
  }

  groupedData!: DataRecord[][]

  constructor(chart: Chart, options: IntervalOptions) {
    super(chart)
    this.update(options)
  }

  update(options: IntervalOptions): void {
    super.update(options)
    const yDimData = this.chart.dataSource.getField(this.yDim).getData()
    const adjustType = typeof options.adjust === 'object' ? options.adjust?.type : options.adjust
    if (adjustType !== 'stack') {
      this.chart.dataSource
        .getField(this.yDim)
        .getScale()
        .update({ domain: [Math.min(...yDimData.map(Number), 0), Math.max(...yDimData.map(Number), 0)] })
    }

    const xScale = this.chart.dataSource.getField(this.xDim).getScale()
    if (!xScale.getOptions().range) {
      const xCount = this.dataSource.getField(this.xDim).getData().filter(uniqueFilter).length
      xScale.update({ range: [1 / (xCount + 1), 1 - 1 / (xCount + 1)] })
    }

    this.options = options
  }

  getCoordinateWidth(chart: Chart, graphicOptions: GraphicOptions, aesthetic: Aesthetic): number {
    const groupCount = this.groupedData?.length
    const stackCount = this.groupedData?.[0]?.length
    const adjustType = isObject(this.options.adjust) ? this.options.adjust?.type : this.options.adjust
    if (chart.coord.isPolar) {
      //针对饼图处理，填满全部空间
      if (stackCount === 1 && adjustType === 'stack') {
        return graphicOptions.width
      } else if (stackCount === 1 && adjustType === 'dodge') {
        return graphicOptions.width / groupCount
      }
    }
    return (aesthetic.size as () => number)()
  }

  graphic(chart: Chart, graphicOptions: GraphicOptions): Element[] {
    const aesthetic = new Aesthetic(this.defaultAestheticOptions, this.options, graphicOptions, chart.dataSource)
    const width = this.getCoordinateWidth(chart, graphicOptions, aesthetic)
    const positionData = this.generatePositionData(chart, aesthetic, {
      xCentered: true,
      width: width,
    })

    return positionData
      .map((group, groupIndex) => {
        return group.map((data, index, row) => {
          const { record, points } = data
          const fillColor = aesthetic.color({ ...record, _group: groupIndex })

          // custom height computation passed by user
          if (this.options.barHeight) {
            const customHeight = this.options.barHeight(record)
            if (customHeight !== undefined) {
              points[1].y = points[0].y - customHeight
            }
          }

          const p: Point[] = [
            {
              x: points[0].x,
              y: points[0].y,
            },
            {
              x: points[1].x,
              y: points[1].y,
            },
            {
              x: points[1].x + width,
              y: points[1].y,
            },
            {
              x: points[0].x + width,
              y: points[0].y,
            },
          ]

          const interaction: Interaction | undefined = !chart.coord?.isPolar
            ? {
                bound: [
                  row[index - 1] ? (row[index - 1].points[1].x + points[1].x) / 2 : graphicOptions.origin.x,
                  -Infinity,
                  row[index + 1] ? (row[index + 1].points[1].x + points[1].x) / 2 : Infinity, // TODO: confirm infinity? graphic right border?
                  Infinity,
                ],
                origin: { x: points[1].x + width / 2, y: points[1].y },
              }
            : undefined

          const strokeWidth = this.options.itemStyle?.borderWidth ?? 0
          const strokeColor = this.options.itemStyle?.borderColor ?? '#fff'

          return {
            cid: this.id,
            eid: `${this.id}-${groupIndex}-${index}`,
            record,
            shapes: [
              {
                type: 'path',
                d: this.coordinate(p, chart.coord, true),
                points: p,
                strokeWidth,
                strokeColor,
                fill: fillColor,
              } as Path,
            ],
            state: {
              active: [
                {
                  type: 'path',
                  d: this.coordinate(p, chart.coord, true),
                  points: p,
                  strokeWidth,
                  strokeColor,
                  fill: fillColor,
                } as Path,
              ],
            },
            interaction,
          }
        })
      })
      .reduce((res, val) => res.concat(val), []) // flatten
  }

  coordinate(points: Point[] | Point, coord: Coordinate, seal?: boolean) {
    if (Array.isArray(points)) {
      return coord.isPolar
        ? generateCircularPath(
            coord,
            points.map(p => coord.convertPoint(p, false))
          )
        : generateSVGPath(
            points.map(p => coord.convertPoint(p)),
            seal
          )
    }
    return coord.convertPoint(points)
  }
}
