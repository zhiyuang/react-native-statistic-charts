// 折线图

import React from 'react'
import isEqual from 'lodash-es/isEqual'
import { ChartComponent, AxisOptions } from 'react-native-statistic-charts-core'
import { BaseComponent } from './base/Component'
import { ChartContext } from './context'

export class AxisComponent extends BaseComponent<AxisOptions> {
  component: ChartComponent

  static contextType = ChartContext

  constructor(props: AxisOptions, context: React.ContextType<typeof ChartContext>) {
    super(props)
    this.component = context.chart.axis(props)
  }

  componentDidUpdate(prevProps: AxisOptions) {
    if (!isEqual(prevProps, this.props)) {
      this.component.update(this.props)
      this.context.repaint(this.component.id, true)
    }
  }
}
