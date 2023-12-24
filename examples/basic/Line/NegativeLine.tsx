import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Line } from 'react-native-statistic-charts'

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
      value: 129,
    },
    {
      date: '2017-06-07',
      value: 135,
    },
    {
      date: '2017-06-08',
      value: 86,
    },
    {
      date: '2017-06-09',
      value: 73,
    },
    {
      date: '2017-06-10',
      value: -85,
    },
    {
      date: '2017-06-11',
      value: 73,
    },
    {
      date: '2017-06-12',
      value: -68,
    },
    {
      date: '2017-06-13',
      value: 92,
    },
    {
      date: '2017-06-14',
      value: 130,
    },
  ]
  config = { type: 'linear', transposed: false }

  render() {
    return (
      <View style={{ marginTop: 100, marginLeft: 10 }}>
        <Chart
          data={this.data}
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
