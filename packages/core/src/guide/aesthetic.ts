import {
  AestheticFunction,
  GraphicOptions,
  DataRecord,
  Dimension,
  DirectValue,
  Point,
  AestheticConfigObject,
  KeywordPosition,
  Geometry,
} from '@/types'
import { isNil, isObject } from '@/utils/judgement'
import { Chart } from '@/chart'
import { ComponentType } from '@/chart/component'

export class Aesthetic {
  position: AestheticFunction<Point>

  constructor(chart: Chart, graphicOptions: GraphicOptions) {
    this.position = this.createPositionFunc(chart, graphicOptions)
  }

  protected formatAestheticOption(
    options: Dimension | DirectValue<unknown> | AestheticConfigObject<unknown>
  ): AestheticConfigObject<any> {
    if (isNil(options)) {
      return {}
    } else if (isObject(options)) {
      return options
    } else if (typeof options === 'string') {
      return { field: options }
    } else {
      return { value: options }
    }
  }

  createPositionFunc(chart: Chart, graphicOptions: GraphicOptions) {
    const xDims = chart.getComponentsByType<Geometry>(ComponentType.Geometry).map(geometry => geometry.xDim)
    const yDims = chart.getComponentsByType<Geometry>(ComponentType.Geometry).map(geometry => geometry.yDim)
    const getPos = (dim: 'x' | 'y', record: DataRecord): number => {
      const field = Object.keys(record).find(field => (dim === 'x' ? xDims : yDims).includes(field))

      if (!field) return 0

      const value = record[field]

      if (Object.values(KeywordPosition).includes(value as KeywordPosition)) {
        switch (value) {
          case KeywordPosition.Max:
            return dim === 'x' ? graphicOptions.origin.x + graphicOptions.width : graphicOptions.origin.y
          case KeywordPosition.Min:
            return dim === 'x' ? graphicOptions.origin.x : graphicOptions.origin.y + graphicOptions.height
          case KeywordPosition.Median:
            return dim === 'x'
              ? graphicOptions.origin.x + graphicOptions.width / 2
              : graphicOptions.origin.y + graphicOptions.height / 2
        }
      } else if (typeof value === 'string' && value.includes('%')) {
        return dim === 'x'
          ? graphicOptions.origin.x + graphicOptions.width * (+value.replace(/\D/g, '') / 100)
          : graphicOptions.origin.y + graphicOptions.height * (+value.replace(/\D/g, '') / 100)
      } else {
        const scale = chart.dataSource
          .getField(field)
          .getScale()
          .position({
            range:
              dim === 'x'
                ? [graphicOptions.origin.x, graphicOptions.origin.x + graphicOptions.width]
                : [graphicOptions.origin.y + graphicOptions.height, graphicOptions.origin.y],
          })
        return scale.map(value)
      }

      return 0
    }

    return (record: DataRecord): Point => ({ x: getPos('x', record), y: getPos('y', record) })
  }
}
