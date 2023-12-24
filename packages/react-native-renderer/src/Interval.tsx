import React from 'react'
import { ChartComponent, IntervalOptions } from 'react-native-statistic-charts-core'
import { BaseComponent } from './base/Component'
import { ChartContext } from './context'

export class IntervalComponent extends BaseComponent<IntervalOptions> {
  component: ChartComponent

  constructor(props: IntervalOptions, context: React.ContextType<typeof ChartContext>) {
    super(props)
    this.component = context.chart.interval(props)
  }

  componentDidUpdate(prevProps: IntervalOptions) {
    if (prevProps.adjust !== this.props.adjust) {
      this.component.update(this.props)
      this.context.repaint()
    } else {
      super.componentDidUpdate(prevProps)
    }
  }
}
