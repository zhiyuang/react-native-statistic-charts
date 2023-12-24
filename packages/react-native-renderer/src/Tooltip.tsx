import React from 'react'
import { ChartComponent, TooltipOptions, TooltipParams } from 'react-native-statistic-charts-core'
import { BaseComponent } from './base/Component'
import { ChartContext } from './context'

export class TooltipComponent extends BaseComponent<TooltipOptions> {
  component: ChartComponent

  constructor(
    props: TooltipOptions & { children?: (params: TooltipParams) => React.ReactNode },
    context: React.ContextType<typeof ChartContext>
  ) {
    super(props)
    const combinedProps = {
      ...props,
      onShow: (params: TooltipParams) => {
        props.onShow?.(params)
        if (props.children) {
          context.setCustomComponent(props.children(params))
        }
      },
      onChange: (params: TooltipParams) => {
        props.onChange?.(params)
        if (props.children) {
          context.setCustomComponent(props.children(params))
        }
      },
      onHide: () => {
        props.onHide?.()
        if (props.children) {
          context.setCustomComponent(null)
        }
      },
    }
    this.component = context.chart.tooltip(combinedProps)
  }
}
