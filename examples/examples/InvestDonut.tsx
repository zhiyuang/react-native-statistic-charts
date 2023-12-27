import React from 'react'
import { View, Dimensions } from 'react-native'
import { Chart, Interval } from 'react-native-statistic-charts'

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
      percent: 0.15,
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
      percent: 0.05,
      a: '1',
    },
  ]

  render() {
    return (
      <View style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 20, 20] }}
          coord={{ transposed: true, type: 'polar', radius: 1, innerRadius: 0.55 }}
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
            itemStyle={{ borderWidth: 3, borderColor: '#fff' }}
          />
        </Chart>
      </View>
    )
  }
}
