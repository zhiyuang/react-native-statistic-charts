import merge from 'lodash-es/merge'
import { GraphicOptions } from '@/types/chart'
import { Element, PointOptions } from '@/types/geometry'
import { DEFAULT_COLORS } from '@/const/color'
import { Chart } from '@/chart'
import { Geometry } from './abstract'
import { Aesthetic } from './aesthetic'
import { Coordinate } from '@/coord'
import { Point as GeometryPoint } from '@/types/geometry'

export class Point extends Geometry {
  type = 'point'
  animatable = false

  options!: PointOptions
  defaultOptions: Partial<PointOptions> = {}

  defaultAestheticOptions = {
    position: {},
    shape: {},
    size: { value: [1, 10] },
    color: { value: DEFAULT_COLORS },
    label: {},
  }

  constructor(chart: Chart, options: PointOptions) {
    super(chart)

    this.update(options)
  }

  update(options: PointOptions) {
    const newOptions = merge({}, this.defaultOptions, options)
    super.update(newOptions)
    this.options = newOptions
  }

  graphic(chart: Chart, graphicOptions: GraphicOptions): Element[] {
    const aesthetic = new Aesthetic(this.defaultAestheticOptions, this.options, graphicOptions, chart.dataSource)

    const data = chart.dataSource.getData()

    return (
      data
        // create element for each record
        .map<Element>((record, index) => {
          const center = this.coordinate(aesthetic.position(record), chart.coord)
          const radius = aesthetic.size(record)
          const fill = aesthetic.color({ ...record })

          return {
            cid: this.id,
            eid: `${this.id}-${index}`,
            record,
            shapes: [
              {
                type: 'circle',
                center,
                radius,
                fill,
              },
            ],
            state: {
              active: [],
            },
          }
        })
    )
  }
  coordinate(point: GeometryPoint, coord: Coordinate) {
    return coord.convertPoint(point)
  }
}
