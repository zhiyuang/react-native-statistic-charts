import React from 'react'
import { View, Dimensions, Button, TextInput, Text } from 'react-native'
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
      value: -116,
      country: 'id',
    },
    {
      date: 'Feb',
      value: 129,
      country: 'id',
    },
    {
      date: 'Mar',
      value: 19,
      country: 'id',
    },
    {
      date: 'Jan',
      value: 90,
      country: 'th',
    },
    {
      date: 'Feb',
      value: 110,
      country: 'th',
    },
    {
      date: 'Mar',
      value: 35,
      country: 'th',
    },
    {
      date: 'Jan',
      value: -50,
      country: 'vn',
    },
    {
      date: 'Feb',
      value: 49,
      country: 'vn',
    },
    {
      date: 'Mar',
      value: 60,
      country: 'vn',
    },
    {
      date: 'Apr',
      value: -50,
      country: 'id',
    },
    {
      date: 'Apr',
      value: 49,
      country: 'vn',
    },
    {
      date: 'Apr',
      value: 60,
      country: 'th',
    },
  ]

  render() {
    return (
      <View style={{ paddingTop: 10, paddingRight: 10, backgroundColor: 'white' }}>
        {/* <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 20, 20] }}
          scale={{ date: { type: ScaleType.Category } }}
          coord={{ transposed: this.state.transposed }}
        >
          <Axis field="date" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeColor: '#ccc' }} />
          <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
          <Interval position="date*value" size={10} groupBy="country" adjust="stack" />
          <Tooltip
            crosshairsType="x"
            crosshairStyle={{ strokeColor: 'orange', strokeWidth: 2, strokeStyle: 'solid' }}
            sticky
          />
        </Chart> */}
        <Chart
          data={this.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [20, 20, 20, 20] }}
          scale={{ date: { type: ScaleType.Category } }}
          coord={{ transposed: this.state.transposed }}
        >
          <Axis field="date" lineStyle={{ strokeColor: '#aaa' }} tickLineStyle={{ strokeColor: '#ccc' }} />
          <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
          <Interval position="date*value" size={10} groupBy="country" adjust={this.state.adjust} />
          <Tooltip
            crosshairsType="x"
            crosshairStyle={{ strokeColor: 'orange', strokeWidth: 2, strokeStyle: 'solid' }}
            sticky
          />
        </Chart>
        <Button
          title={`Change adjust to ${this.state.adjust.type === 'stack' ? 'dodge' : 'stack'}`}
          onPress={() =>
            this.setState({
              adjust: {
                type: this.state.adjust.type === 'stack' ? 'dodge' : 'stack',
                marginRatio: this.state.adjust.marginRatio,
              },
            })
          }
        />
        <Button
          title={`Change Coord transposed to ${this.state.transposed ? 'false' : 'true'}`}
          onPress={() => this.setState({ transposed: !this.state.transposed })}
        />
        {this.state.adjust.type === 'dodge' && (
          <>
            <Text style={{ marginLeft: 20 }}>marginRatio: </Text>
            <TextInput
              style={{ margin: 10, borderWidth: 1 }}
              value={`${this.state.adjust.marginRatio}`}
              onChangeText={val =>
                this.setState({ adjust: { type: this.state.adjust.type, marginRatio: Number(val) } })
              }
            />
          </>
        )}
      </View>
    )
  }
}
