import React from 'react'
import { ChartComponent, PointOptions } from 'react-native-statistic-charts-core'
import { BaseComponent } from './base/Component'
import { ChartContext } from './context'

export class PointComponent extends BaseComponent<PointOptions> {
  component: ChartComponent

  constructor(props: PointOptions, context: React.ContextType<typeof ChartContext>) {
    super(props)
    this.component = context.chart.point(props)
  }
}
