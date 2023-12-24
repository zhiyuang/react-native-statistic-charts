import merge from 'lodash-es/merge'
import { Base, BaseOptions, LinearOptions, TimeOptions, Continuous, Identity, Linear, Time, Point } from '@antv/scale'
import { FieldData } from '@/types/chart'
import { CategoryOptions, ScaleOptions, ScaleType } from '@/types/scale'
import { uniqueFilter } from '@/utils/data'
import { isDateString } from '@/utils/judgement'
import linearTick from './tickMethods/linearTick'
import categoryTick from './tickMethods/categoryTick'

const CATEGORY_DEFAULT_COUNT = 5

export default class Scale {
  type: ScaleType
  private data: FieldData[]
  // private rangeRatio: [number, number] // [0, 1] 区间的范围
  protected defaultOptions: BaseOptions
  protected options: BaseOptions
  protected scale: Base<BaseOptions>
  constructor(data: FieldData[], options: Partial<ScaleOptions> = {}) {
    this.data = data
    const { type, ...scaleOptions } = options

    if (type) {
      // user specified type
      this.type = type
    } else {
      // identify sale type
      const sampleFieldData = data[0]
      switch (typeof sampleFieldData) {
        case 'undefined': {
          this.type = ScaleType.Identity
          break
        }
        case 'number': {
          this.type = ScaleType.Linear
          break
        }
        case 'string': {
          if (isDateString(sampleFieldData)) {
            this.type = ScaleType.Time
          } else {
            this.type = ScaleType.Category
          }
        }
      }
    }

    // generate default options
    switch (this.type) {
      case ScaleType.Linear: {
        const scaleOptions: LinearOptions = {
          domain: [Math.min(...data.map(Number)), Math.max(...data.map(Number))],
          nice: false,
          tickMethod: linearTick,
        }
        this.defaultOptions = scaleOptions
        break
      }
      case ScaleType.Time: {
        const dateValues = data.map(value => new Date(value).getTime())
        const scaleOptions: TimeOptions = {
          domain: [new Date(Math.min(...dateValues)), new Date(Math.max(...dateValues))],
        }
        this.defaultOptions = scaleOptions
        break
      }
      case ScaleType.TimeCategory:
      case ScaleType.Category: {
        const scaleOptions: CategoryOptions = {
          domain: data.filter(uniqueFilter),
          tickCount: CATEGORY_DEFAULT_COUNT,
        }
        this.defaultOptions = scaleOptions
        break
      }
      default: {
        this.defaultOptions = {}
      }
    }

    // merge options
    this.options = merge(this.defaultOptions, scaleOptions)

    // create scale
    switch (this.type as ScaleType) {
      case ScaleType.Identity:
        this.scale = new Identity(this.options)
        break
      case ScaleType.Linear:
        this.scale = new Linear(this.options)
        break
      case ScaleType.Time:
        this.scale = new Time(this.options)
        break
      case ScaleType.Category:
      case ScaleType.TimeCategory:
        this.scale = new Point(this.options)
    }
  }

  protected getDefaultOptions(): Partial<BaseOptions> {
    return this.defaultOptions
  }

  getOptions(): BaseOptions {
    return this.options
  }

  clone(): Scale {
    return new Scale(this.data, { type: this.type, ...this.options })
  }

  map(value: FieldData) {
    return this.type === ScaleType.Time ? this.scale.map(new Date(value)) : this.scale.map(value)
  }

  invert(value: FieldData) {
    return this.scale.invert(value)
  }

  update(updatedOptions: Partial<BaseOptions>) {
    this.options = merge(this.options, updatedOptions)
    this.scale?.update(updatedOptions)

    return this
  }

  derive(updatedOptions: Partial<BaseOptions>): Scale {
    const scale = this.clone()
    scale.update(updatedOptions)
    return scale
  }

  normalization() {
    return this.derive({ range: [0, 1] })
  }

  /**
   * generate a new scale for position purpose, will extend domain to
   * the range of ticks
   *
   * @param {[number, number]} range
   * @memberof Scale
   */
  position({ range }: { range: [number, number] }) {
    const rangeRatio = this.options.range ?? [0, 1]
    const computedRange = rangeRatio.map(ratio => range[0] + ratio * (range[1] - range[0]))
    if (this.scale instanceof Continuous) {
      let current = this as Scale
      // sometimes ticks domain is larger than scale domain, this even happens again after we extends domain here
      // so we should extends until this condition will not happen
      // this is why i use while loop here
      do {
        const ticks = current.getTicks()
        const domain = current.getDomain() ?? []
        const extendedDomain = [
          domain[0] < ticks[0] ? domain[0] : ticks[0],
          domain[domain.length - 1] > ticks[ticks.length - 1] ? domain[domain.length - 1] : ticks[ticks.length - 1],
        ]

        current = this.derive({ domain: extendedDomain, range: computedRange })
      } while (
        (current.getDomain() ?? [])[0] > current.getTicks()[0] ||
        (current.getDomain() ?? [])[(current.getDomain() ?? []).length - 1] <
          current.getTicks()[current.getTicks().length - 1]
      )

      return current
    }

    return this.derive({ range: computedRange })
  }

  getTicks() {
    if (this.scale instanceof Continuous) {
      return this.scale.getTicks()
    } else if ([ScaleType.Category, ScaleType.TimeCategory].includes(this.type)) {
      return categoryTick(
        (this.scale as Point).getDomain() ?? [],
        (this.options as CategoryOptions).tickCount ?? CATEGORY_DEFAULT_COUNT
      )
    } else {
      return this.scale.getOptions().domain ?? []
    }
  }

  getDomain() {
    return this.scale.getOptions().domain
  }
}
