import { GraphicOptions } from '@/types/chart'
import { Element } from '@/types/geometry'
import type { Chart } from '.'

export enum ComponentType {
  Geometry = 1,
  Axis,
  Legend,
  Tooltip,
  GuideLine,
  GuidePoint,
  GuideLabel,
}

export abstract class ChartComponent {
  protected chart: Chart
  id: string
  // abstract elements: Element[]
  constructor(chart: Chart, type: ComponentType) {
    this.chart = chart
    this.id = cid(type)
  }

  abstract animatable: boolean

  abstract update(options: unknown): void

  abstract graphic(chart: Chart, graphicOptions: GraphicOptions): Element[]
}

export class ComponentIdGenerator {
  static counter = {
    [ComponentType.Geometry]: 0,
    [ComponentType.Axis]: 0,
    [ComponentType.Legend]: 0,
    [ComponentType.Tooltip]: 0,
    [ComponentType.GuideLine]: 0,
    [ComponentType.GuidePoint]: 0,
    [ComponentType.GuideLabel]: 0,
  }

  static gen(type: ComponentType) {
    return `${type}${ComponentIdGenerator.counter[type]++}`
  }
}

export const cid = ComponentIdGenerator.gen
