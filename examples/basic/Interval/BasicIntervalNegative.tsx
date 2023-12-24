import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Interval, ScaleType } from 'react-native-statistic-charts'

export default class BarDemo extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  data = [
    {
      date: '2017-06-05',
      value: -116,
    },
    {
      date: '2017-06-06',
      value: -129,
    },
  ]

  render() {
    return (
      <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 20, 20] }}
          scale={{ date: { type: ScaleType.Category } }}
        >
          <Axis field="date" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeColor: '#ccc' }} />
          <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
          <Interval
            position="date*value"
            size={10}
            groupBy="country"
            color={{ field: 'value', value: record => (record['value'] > 0 ? 'red' : 'green') }}
          />
          <Tooltip
            crosshairsType="x"
            crosshairStyle={{ strokeColor: 'orange', strokeWidth: 2, strokeStyle: 'solid' }}
            sticky
          />
        </Chart>
      </View>
    )
  }
}
