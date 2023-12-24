import React from 'react'
import { ChartComponent, GuideLineOptions, GuidePointOptions, GuideLabelOptions } from 'react-native-statistic-charts-core'
import { BaseComponent } from './base/Component'
import { ChartContext } from './context'

export class GuideLineComponent extends BaseComponent<GuideLineOptions> {
  component: ChartComponent

  constructor(props: GuideLineOptions, context: React.ContextType<typeof ChartContext>) {
    super(props)
    this.component = context.chart.guideLine(props)
  }
}

export class GuidePointComponent extends BaseComponent<GuidePointOptions> {
  component: ChartComponent

  constructor(props: GuidePointOptions, context: React.ContextType<typeof ChartContext>) {
    super(props)
    this.component = context.chart.guidePoint(props)
  }
}

export class GuideLabelComponent extends BaseComponent<GuideLabelOptions> {
  component: ChartComponent

  constructor(props: GuideLabelOptions, context: React.ContextType<typeof ChartContext>) {
    super(props)
    this.component = context.chart.guideLabel(props)
  }
}
