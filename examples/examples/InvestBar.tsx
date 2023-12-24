import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Interval, ScaleType } from 'react-native-statistic-charts'

export default class InvestBar extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  data = [
    {
      date: 'Dec',
      value: 116,
    },
    {
      date: 'Jan',
      value: -129,
    },
    {
      date: 'Feb',
      value: 10,
    },
    {
      date: 'Mar',
      value: 12,
    },
    {
      date: 'Apr',
      value: 18,
    },
    {
      date: 'May',
      value: 12,
    },
    {
      date: 'Jun',
      value: 19,
    },
    {
      date: 'Jul',
      value: -12,
    },
  ]

  get chartScale() {
    const xTickCount = Math.min(this.data.length, 5)
    const yTickCount = Math.min(this.data.length, 6)
    const partition = Math.max(1, this.data.length) * 2
    return {
      date: {
        type: ScaleType.Category,
        tickCount: xTickCount,
        range: [1 / partition, (partition - 1) / partition],
      },
      value: { type: ScaleType.Linear, tickCount: yTickCount },
    }
  }

  render() {
    return (
      <View style={{ paddingTop: 100, height: Dimensions.get('window').height, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 20, 20] }}
          scale={this.chartScale}
        >
          <Axis field="date" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeWidth: 0 }} tickCount={8} />
          <Axis
            field="value"
            lineStyle={{ strokeWidth: 0 }}
            tickLineStyle={{ strokeWidth: 0 }}
            grid
            gridLineStyle={{ strokeStyle: 'dashed', dashedStyle: [2] }}
            labelStyle={{ offset: 6 }}
          />
          <Interval
            position="date*value"
            size={10}
            groupBy="country"
            color={{ field: 'value', value: record => (record['value'] > 0 ? 'green' : 'red') }}
            // barHeight={({ value }) => value < 0 ? -10 : 10}
          />
          <Tooltip
            crosshair
            crosshairsType="x"
            crosshairStyle={{ strokeColor: 'orange', strokeWidth: 1, strokeStyle: 'solid' }}
            sticky
            label={false}
          />
        </Chart>
      </View>
    )
  }
}
