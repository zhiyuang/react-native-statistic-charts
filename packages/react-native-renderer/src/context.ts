import React from 'react'
import noop from 'lodash-es/noop'
import { Chart } from 'react-native-statistic-charts-core'
import { Element } from 'react-native-statistic-charts-core'

export const ChartContext = React.createContext<{
  chart: Chart
  observe: (cid: string, cb: (elements: Element[]) => void) => void
  repaint: (cid: string, layout?: boolean) => void
  destory: (cid: string) => void
  setCustomComponent: (comp: React.ReactNode) => void
}>({
  chart: new Chart({ data: [], style: { width: 0, height: 0 } }),
  observe: noop,
  repaint: noop,
  destory: noop,
  setCustomComponent: noop,
})
