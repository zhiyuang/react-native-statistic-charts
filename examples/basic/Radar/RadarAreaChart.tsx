import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Area, ScaleType, Line } from 'react-native-statistic-charts'

export default class LineDemo extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
      activeX: 10,
      activeY: 0,
    }
  }

  data = [
    {
      name: 'London',
      date: 'Jan.',
      value: 28.9,
    },
    {
      name: 'London',
      date: 'Feb.',
      value: 68.8,
    },
    {
      name: 'London',
      date: 'Mar.',
      value: 39.3,
    },
    {
      name: 'London',
      date: 'Apr.',
      value: 41.4,
    },
    {
      name: 'London',
      date: 'May.',
      value: 47,
    },
    {
      name: 'London',
      date: 'Jun.',
      value: 30.3,
    },
    {
      name: 'London',
      date: 'Jul.',
      value: 24,
    },
    {
      name: 'London',
      date: 'Aug.',
      value: 35.6,
    },
    {
      name: 'Berlin',
      date: 'Jan.',
      value: 12.4,
    },
    {
      name: 'Berlin',
      date: 'Feb.',
      value: 23.2,
    },
    {
      name: 'Berlin',
      date: 'Mar.',
      value: 34.5,
    },
    {
      name: 'Berlin',
      date: 'Apr.',
      value: 79.7,
    },
    {
      name: 'Berlin',
      date: 'May.',
      value: 52.6,
    },
    {
      name: 'Berlin',
      date: 'Jun.',
      value: 35.5,
    },
    {
      name: 'Berlin',
      date: 'Jul.',
      value: 37.4,
    },
    {
      name: 'Berlin',
      date: 'Aug.',
      value: 42.4,
    },
  ]
  config = { type: 'linear', transposed: false }

  render() {
    return (
      <View style={{ paddingTop: 100, height: Dimensions.get('window').height, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [10, 20, 0, 20] }}
          coord={{ type: 'polar' }}
          scale={{ date: { type: ScaleType.TimeCategory, range: [0, 14 / 16], tickCount: 8 } }}
        >
          <Axis
            field="date"
            lineStyle={{ strokeColor: '#aaa' }}
            tickLineStyle={{ strokeColor: '#ccc' }}
            grid
            labelStyle={{ offset: 10 }}
          />
          <Axis field="value" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeColor: '#ccc' }} grid />
          <Area position="date*value" groupBy="name" />
          <Line position="date*value" size={2} groupBy="name" />
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
