import React from 'react'
import { View, Dimensions, Button } from 'react-native'
import { Chart, Tooltip, Interval } from 'react-native-statistic-charts'

export default class BarDemo extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      adjust: 'stack',
      transposed: true,
      type: 'polar',
    }
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
      percent: 0.2,
      a: '1',
    },
    {
      name: 'Category4',
      percent: 0.1,
      a: '1',
    },
  ]

  render() {
    return (
      <View style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: 'white' }}>
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 20, 20] }}
          coord={{ transposed: this.state.transposed, type: this.state.type }}
        >
          <Interval
            position="a*percent"
            adjust={{ type: this.state.adjust, marginRatio: 10 }}
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
        <Button
          title={`Change adjust to ${this.state.adjust === 'stack' ? 'dodge' : 'stack'}`}
          onPress={() => this.setState({ adjust: this.state.adjust === 'stack' ? 'dodge' : 'stack' })}
        />
        <Button
          title={`Change Coord transposed to ${this.state.transposed ? 'false' : 'true'}`}
          onPress={() => this.setState({ transposed: !this.state.transposed })}
        />
        <Button
          title={`Change Coord tyoe to ${this.state.type === 'polar' ? 'rect' : 'polar'}`}
          onPress={() => this.setState({ type: this.state.type === 'polar' ? 'rect' : 'polar' })}
        />
      </View>
    )
  }
}
