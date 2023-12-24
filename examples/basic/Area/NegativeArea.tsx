import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Area, ScaleType } from 'react-native-statistic-charts'

export default class LineDemo extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      activeX: 10,
      activeY: 0,
      rangeX: [0, 1],
      rangeY: [0, 1],
    }
  }

  data = [
    {
      date: '2017-06-05',
      value: 116,
    },
    {
      date: '2017-06-06',
      value: -129,
    },
    {
      date: '2017-06-07',
      value: 135,
    },
    {
      date: '2017-06-08',
      value: -80,
    },
    {
      date: '2017-06-09',
      value: 102,
    },
  ]
  config = { type: 'linear', transposed: false }

  render() {
    return (
      <View style={{ paddingTop: 100, height: Dimensions.get('window').height, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [10, 20, 0, 20] }}
          scale={{
            date: { type: ScaleType.TimeCategory, range: this.state.rangeX },
            value: { type: ScaleType.Linear, range: this.state.rangeY },
          }}
        >
          <Axis
            field="date"
            lineStyle={{ strokeColor: '#aaa' }}
            tickLineStyle={{ strokeColor: '#ccc' }}
            tickCount={3}
          />
          <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
          <Area position="date*value" size={2} color={['orange']} />
          <Tooltip
            crosshair
            crosshairsType="x"
            crosshairStyle={{ strokeColor: 'orange', strokeWidth: 2, strokeStyle: 'solid' }}
            sticky
          />
        </Chart>
      </View>
    )
  }
}
