import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Line } from 'react-native-statistic-charts'

export default class LineDemo extends React.Component {
  state: any
  constructor(props: any) {
    super(props)
    this.state = {
      activeX: 10,
      activeY: 0,
      data: this.data,
    }
  }

  data = [
    {
      date: '2017-06-05',
      value: 0.1113,
    },
    {
      date: '2017-06-06',
      value: 0.1114,
    },
    {
      date: '2017-06-07',
      value: 0.1115,
    },
    {
      date: '2017-06-08',
      value: 0.1112,
    },
    {
      date: '2017-06-09',
      value: 0.1113,
    },
  ]

  render() {
    return (
      <View style={{ marginTop: 100, marginLeft: 10 }}>
        <Chart
          data={this.state.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [10, 20, 0, 20] }}
        >
          <Axis field="date" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeColor: '#ccc' }} />
          <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
          <Line position="date*value" size={2} />
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
