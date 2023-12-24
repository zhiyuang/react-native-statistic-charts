import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Interval, ScaleType } from 'react-native-statistic-charts'

export default class BarDemo extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      adjust: { type: 'dodge', marginRatio: 10 },
      transposed: false,
    }
  }

  data = [
    {
      date: 'Jan',
      value: 46,
    },
    {
      date: 'Feb',
      value: 39,
    },
    {
      date: 'Mar',
      value: 19,
    },
    {
      date: 'Apr',
      value: 29,
    },
    {
      date: 'May',
      value: 10,
    },
    {
      date: 'June',
      value: 13,
    },
  ]

  render() {
    return (
      <View style={{ paddingTop: 100, height: Dimensions.get('window').height, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 0, 10] }}
          scale={{ date: { type: ScaleType.Category } }}
          coord={{ transposed: false }}
        >
          <Axis field="date" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeColor: '#ccc' }} />
          <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
          <Interval position="date*value" size={15} groupBy="country" color={{ value: 'orange' }} />
          <Tooltip
            crosshair
            crosshairsType="x"
            crosshairStyle={{ strokeColor: 'green', strokeWidth: 2, strokeStyle: 'solid' }}
            sticky
          />
        </Chart>
      </View>
    )
  }
}
