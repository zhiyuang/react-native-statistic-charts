import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Axis, Tooltip, Area, ScaleType } from 'react-native-statistic-charts'

export default class BarDemo extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  data = [
    {
      date: '2017-06-05',
      value: 116,
      country: 'id',
    },
    {
      date: '2017-06-06',
      value: 129,
      country: 'id',
    },
    {
      date: '2017-06-07',
      value: 19,
      country: 'id',
    },
    {
      date: '2017-06-05',
      value: 90,
      country: 'th',
    },
    {
      date: '2017-06-06',
      value: 110,
      country: 'th',
    },
    {
      date: '2017-06-07',
      value: 35,
      country: 'th',
    },
    {
      date: '2017-06-05',
      value: 50,
      country: 'vn',
    },
    {
      date: '2017-06-06',
      value: 49,
      country: 'vn',
    },
    {
      date: '2017-06-07',
      value: 60,
      country: 'vn',
    },
  ]

  render() {
    return (
      <View style={{ paddingTop: 100, height: Dimensions.get('window').height, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 20, 20] }}
          scale={{ date: { type: ScaleType.TimeCategory } }}
        >
          <Axis field="date" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeColor: '#ccc' }} />
          <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
          <Area position="date*value" groupBy="country" adjust={'stack'} color={['orange']} />
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
