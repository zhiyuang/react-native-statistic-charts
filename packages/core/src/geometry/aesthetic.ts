import merge from 'lodash-es/merge'
import { createInterpolateColor, Ordinal } from '@antv/scale'
import {
  AestheticFunction,
  AestheticOptions,
  GraphicOptions,
  DataRecord,
  Dimension,
  DirectValue,
  Point,
  AestheticAttrs,
  AestheticConfigObject,
} from '@/types'
import type { DataSource } from '@/chart/data'
import { mapObject } from '@/utils/data'
import { isNil, isObject } from '@/utils/judgement'
import { isContinuesScale } from '@/utils/scale'
import { noop } from '@/utils/function'

export class Aesthetic {
  position: AestheticFunction<Point>
  size: AestheticFunction<number> | (() => number)
  shape: AestheticFunction<string>
  color: AestheticFunction<string>
  label: AestheticFunction<string>
  constructor(
    defaultOptions: Record<AestheticAttrs, AestheticConfigObject<any>>,
    options: AestheticOptions,
    graphicOptions: GraphicOptions,
    ds: DataSource
  ) {
    const _options: {
      position: AestheticConfigObject<null>
      size: AestheticConfigObject<number>
      shape: AestheticConfigObject<string>
      color: AestheticConfigObject<string>
      label: AestheticConfigObject<null>
    } = merge(defaultOptions, mapObject<any, any>(options, this.formatAestheticOption))

    this.position = this.createPositionFunc(_options.position, graphicOptions, ds)
    this.size = this.createSizeFunc(_options.size, ds)
    this.shape = this.createShapeFunc()
    this.color = this.createColorFunc(_options.color, ds)
    this.label = this.createLabelFunc()
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

  createPositionFunc(options: AestheticConfigObject<null>, graphicOptions: GraphicOptions, ds: DataSource) {
    const [xDim, yDim] = options.field?.split('*') ?? []
    const xScale = ds
      .getField(xDim)
      .getScale()
      .position({ range: [graphicOptions.origin.x, graphicOptions.origin.x + graphicOptions.width] })
    const yScale = ds
      .getField(yDim)
      .getScale()
      .position({ range: [graphicOptions.origin.y + graphicOptions.height, graphicOptions.origin.y] })

    return (record: DataRecord) => ({ x: xScale.map(record[xDim]), y: yScale.map(record[yDim]) })
  }

  createSizeFunc(options: AestheticConfigObject<number>, ds: DataSource) {
    if (!options.value) return noop

    if (typeof options.value === 'function') {
      const cb = options.value
      return (record: DataRecord) => cb(record)
    }

    const dim = options.field
    const range = Array.isArray(options.value) ? options.value : [options.value]

    if (dim) {
      const scale = ds.getField(dim).getScale().derive({ range })
      return (record: DataRecord) => scale.map(record[dim])
    }

    return () => range[0]
  }

  createShapeFunc() {
    // TODO:
    return () => ''
  }

  createColorFunc(options: AestheticConfigObject<string>, ds: DataSource) {
    if (!options.value) return noop

    if (typeof options.value === 'function') {
      const cb = options.value
      return (record: DataRecord) => cb(record)
    }

    const dim = options.field
    const range = Array.isArray(options.value) ? options.value : [options.value]

    if (dim) {
      const scale = ds.getField(dim).getScale().clone()
      if (isContinuesScale(scale)) {
        scale.update({ range, interpolate: createInterpolateColor })
        return (record: DataRecord) => scale.map(record[dim])
      } else {
        const ordinalScale = new Ordinal({
          domain: scale.getOptions().domain,
          range,
        })

        return (record: DataRecord) => ordinalScale.map(record[dim])
      }
    }

    return (record: DataRecord) => (record._group ? range[+record._group % range.length] : range[0])
  }

  createLabelFunc() {
    // TODO:
    return () => ''
  }
}
