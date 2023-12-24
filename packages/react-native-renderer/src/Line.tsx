import React from 'react'
import { ChartComponent, LineOptions } from 'react-native-statistic-charts-core'
import { BaseComponent } from './base/Component'
import { ChartContext } from './context'

export class LineComponent extends BaseComponent<LineOptions> {
  component: ChartComponent

  constructor(props: LineOptions, context: React.ContextType<typeof ChartContext>) {
    super(props)
    this.component = context.chart.line(props)
  }
}
