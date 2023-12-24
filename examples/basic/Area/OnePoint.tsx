import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Area, Line, ScaleType } from 'react-native-statistic-charts'

export default class AreaDemo extends React.Component<null, { color: string }> {
  colors = ['orange', '#F69113', '#30B566', '#4080EE']
  colorIdx = 1

  state = { color: this.colors[0] }

  data = [
    {
      date: '2017-06-05',
      value: 116,
    },
  ]

  render() {
    return (
      <View style={{ marginTop: 100, marginLeft: 10 }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [10, 20, 0, 20] }}
          scale={{ date: { type: ScaleType.TimeCategory }, value: { type: ScaleType.Linear, tickCount: 1 } }}
        >
          <Axis
            field="date"
            tickCount={3}
            lineStyle={{ strokeColor: '#aaa' }}
            tickLineStyle={{ strokeColor: '#ccc' }}
          />
          <Axis
            field="value"
            grid
            lineStyle={{ strokeWidth: 0 }}
            tickLineStyle={{ strokeWidth: 0 }}
            gridLineStyle={{ strokeStyle: 'dashed', dashedStyle: [2] }}
          />
          <Line position="date*value" />
          <Area
            position="date*value"
            color={[this.state.color]}
            style={{ fill: 'linear-gradient(90deg, #FFB802 0%, #FFFDF8 100%)' }}
          />
          <Tooltip
            crosshair
            crosshairsType="x"
            crosshairStyle={{ strokeColor: this.state.color, strokeWidth: 1, strokeStyle: 'solid' }}
            sticky
          />
        </Chart>
      </View>
    )
  }
}
