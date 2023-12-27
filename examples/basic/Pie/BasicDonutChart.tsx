import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Tooltip, Interval } from 'react-native-statistic-charts'

export default class BarDemo extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  data = [
    {
      name: 'Category1',
      percent: 0.4,
      a: '1',
    },
    {
      name: 'Category2',
      percent: 0.3,
      a: '1',
    },
    {
      name: 'Category3',
      percent: 0.1,
      a: '1',
    },
    {
      name: 'Category4',
      percent: 0.05,
      a: '1',
    },
    {
      name: 'Category5',
      percent: 0.05,
      a: '1',
    },
    {
      name: 'Category6',
      percent: 0.02,
      a: '1',
    },
    {
      name: 'Category7',
      percent: 0.02,
      a: '1',
    },
    {
      name: 'Category8',
      percent: 0.02,
      a: '1',
    },
    {
      name: 'Category9',
      percent: 0.02,
      a: '1',
    },
    {
      name: 'Category10',
      percent: 0.02,
      a: '1',
    },
  ]

  render() {
    return (
      <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 20, 20] }}
          coord={{ transposed: true, type: 'polar', radius: 1, innerRadius: 0.5 }}
        >
          <Interval
            position="a*percent"
            adjust="stack"
            groupBy="name"
            color={{
              value: [
                '#EDA500',
                '#F97B0D',
                '#EE2C4C',
                '#BF3D39',
                '#803F62',
                '#40428A',
                '#0046AB',
                '#0079A5',
                '#26AA99',
                '#7EA84D',
              ],
            }}
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
