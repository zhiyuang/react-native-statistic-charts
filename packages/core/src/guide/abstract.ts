import { Element } from '@/types/geometry'
import type { Chart } from '@/chart'
import { ChartComponent, ComponentType } from '@/chart/component'

export abstract class Guide extends ChartComponent {
  constructor(chart: Chart, type: ComponentType) {
    super(chart, type)
  }

  abstract options: Record<string, any>

  abstract graphic(...args: any[]): Element[]
}
