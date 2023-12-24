import merge from 'lodash-es/merge'
import { GraphicOptions } from '@/types/chart'
import { Element, AreaOptions, Point, Interaction } from '@/types/geometry'
import { computeProportionalGradient } from '@/utils/color'
import { generateSVGPath } from '@/utils/svg'
import { DEFAULT_COLORS } from '@/const/color'
import { Chart } from '@/chart'
import { Geometry } from './abstract'
import { Aesthetic } from './aesthetic'
import { Coordinate } from '@/coord'

export class Area extends Geometry {
  type = 'area'
  animatable = true

  options!: AreaOptions
  defaultOptions: Partial<AreaOptions> = { style: { fillOpacity: 0.3 } }

  defaultAestheticOptions = {
    position: {},
    shape: {},
    size: { value: [1, 10] },
    color: { value: DEFAULT_COLORS },
    label: {},
  }

  constructor(chart: Chart, options: AreaOptions) {
    super(chart)

    this.update(options)
  }

  update(options: AreaOptions) {
    const newOptions = merge({}, this.defaultOptions, options)
    super.update(newOptions)
    this.options = newOptions
  }

  graphic(chart: Chart, graphicOptions: GraphicOptions): Element[] {
    const aesthetic = new Aesthetic(this.defaultAestheticOptions, this.options, graphicOptions, chart.dataSource)

    const positionData = this.generatePositionData(chart, aesthetic)

    return (
      positionData
        // handle each group
        .map((group, groupIndex) => {
          const minY = Math.min(...group.map(position => aesthetic.position(position.record)!.y))
          const maxY = chart.layoutManager.origin.y
          const area: Element[] = group
            .concat(chart.coord.isPolar ? [group[0]] : []) //fix path closed problem
            // create element for each record
            .map<Element>((position, index, data): any => {
              const from = position
              //TODO: type any
              const prev = data[index - 1] ?? position
              const to = data[index + 1] ?? position
              const strokeColor = aesthetic.color({ ...from.record, _group: groupIndex })
              let fill = this.options.style?.fill
              /**
               *  Because the linear-gradient config is for whole area,
               *  when we split the area into several rect, we should recompute the gradient
               */
              if (fill?.includes('linear-gradient')) {
                fill = computeProportionalGradient(fill, Math.min(from.points[1].y, to.points[1].y), maxY, minY)
              }

              const areaPoints = [from.points[0], from.points[1], to.points[1], to.points[0]]
              const pathD = this.coordinate(areaPoints, chart.coord, true)
              const interaction: Interaction | undefined = !chart.coord.isPolar
                ? {
                    bound: [
                      data[index - 1] ? (prev.points[0].x! + from.points[0].x!) / 2 : graphicOptions.origin.x,
                      -Infinity,
                      data[index + 1] ? (to.points[0].x! + from.points[0].x!) / 2 : Infinity, // TODO: confirm infinity? graphic right border?
                      Infinity,
                    ],
                    origin: from.points[1],
                  }
                : undefined

              return {
                // area
                cid: this.id,
                eid: `${this.id}-${groupIndex}-${index}-area`,
                record: from.record,
                shapes: [
                  {
                    type: 'path',
                    d: pathD,
                    points: areaPoints,
                    strokeWidth: 0,
                    fill: fill ?? strokeColor,
                    fillOpacity: this.options.style?.fillOpacity,
                  },
                ],
                state: {
                  active: [
                    {
                      type: 'path',
                      d: pathD,
                      points: areaPoints,
                      strokeWidth: 0,
                      fill: fill ?? strokeColor,
                      fillOpacity: this.options.style?.fillOpacity,
                    },
                  ],
                },
                interaction,
              }
            })

          return area
        })
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
