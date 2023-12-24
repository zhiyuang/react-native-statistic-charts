import React from 'react'
import { ChartComponent, AreaOptions } from 'react-native-statistic-charts-core'
import { BaseComponent } from './base/Component'
import { ChartContext } from './context'

export class AreaComponent extends BaseComponent<AreaOptions> {
  component: ChartComponent

  constructor(props: AreaOptions, context: React.ContextType<typeof ChartContext>) {
    super(props)
    this.component = context.chart.area(props)
  }
}
