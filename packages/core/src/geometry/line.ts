import { GraphicOptions } from '@/types/chart'
import { Element, Interaction, LineOptions, Point } from '@/types/geometry'
import { DEFAULT_COLORS } from '@/const/color'
import { Chart } from '@/chart'
import { Geometry } from './abstract'
import { Aesthetic } from './aesthetic'
import { generateSVGPath } from '@/utils/svg'
import { Coordinate } from '@/coord'

export class Line extends Geometry {
  type = 'line'
  animatable = true
  options!: LineOptions

  defaultAestheticOptions = {
    position: {},
    shape: {},
    size: { value: [1, 10] },
    color: { value: DEFAULT_COLORS },
    label: {},
  }

  constructor(chart: Chart, options: LineOptions) {
    super(chart)
    this.update(options)
  }

  update(options: LineOptions): void {
    super.update(options)
    this.options = options
  }

  graphic(chart: Chart, graphicOptions: GraphicOptions): Element[] {
    const aesthetic = new Aesthetic(this.defaultAestheticOptions, this.options, graphicOptions, chart.dataSource)

    const positionData = this.generatePositionData(chart, aesthetic)
    return (
      positionData
        // handle each group
        .map((group, groupIndex) =>
          group
            .concat(chart.coord.isPolar ? [group[0]] : []) //fix path closed problem
            // create element for each record
            .map<any>((position, index, data) => {
              //TODO: any should be Element here
              const prev = data[index - 1] ?? position
              const from: any = position
              const to = data[index + 1] ?? position
              const strokeWidth = aesthetic.size(from.record)
              const strokeColor = aesthetic.color({ ...from.record, _group: groupIndex })
              const points: Point[] = data.length !== 1 ? [from.points[1], to.points[1]] : [from.points[1]]
              const pathD = this.coordinate(points, chart.coord)
              const interaction: Interaction | undefined = !chart.coord.isPolar
                ? {
                    bound: [
                      data[index - 1] ? (prev.points[0].x + from.points[0].x) / 2 : graphicOptions.origin.x,
                      -Infinity,
                      data[index + 1] ? (to.points[0].x + from.points[0].x) / 2 : Infinity, // TODO: confirm infinity? graphic right border?
                      Infinity,
                    ],
                    origin: from.points[1],
                  }
                : undefined

              return {
                cid: this.id,
                eid: `${this.id}-${groupIndex}-${index}`,
                record: from.record,
                shapes: [
                  data.length !== 1 // one single point
                    ? {
                        type: 'path',
                        d: pathD,
                        strokeWidth,
                        strokeColor,
                        points,
                      }
                    : {
                        type: 'circle',
                        center: this.coordinate(points[0], chart.coord),
                        radius: strokeWidth,
                        strokeColor: strokeColor,
                        strokeWidth: strokeWidth,
                        fill: strokeColor,
                      },
                ],
                state: {
                  active: [
                    {
                      type: 'path',
                      d: pathD,
                      strokeWidth,
                      strokeColor,
                    },
                  ],
                },
                interaction,
              }
            })
        )
        .reduce((res, val) => res.concat(val), []) // flatten
    )
  }

  coordinate(points: Point[] | Point, coord: Coordinate, seal?: boolean) {
    if (Array.isArray(points)) {
      const p = points.map(p => coord.convertPoint(p))
      return generateSVGPath(p, seal)
    }
    return coord.convertPoint(points)
  }
}
