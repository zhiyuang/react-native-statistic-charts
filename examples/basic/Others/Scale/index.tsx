import React from 'react'
import { View, Dimensions, Button, FlatList } from 'react-native'
import { Chart, Axis, Area, Line, ScaleType, Tooltip } from 'react-native-statistic-charts'
import { oneDay, oneMonth, oneYear, threeMonth, twoDay, zero } from './mock'
import Big from 'big.js'

export default class ScaleDemo extends React.Component<any, any> {
  dataSet: any
  constructor(props: any) {
    super(props)

    const { series: data, maxValue, minValue } = oneDay
    const temp = new Big(maxValue).sub(new Big(minValue)).times(3)
    const maxDomain = new Big(maxValue).plus(temp) || 2500
    const minDomain = new Big(minValue).sub(temp)
    console.log('留上下buffer', temp, minValue, maxValue, +minDomain, +maxDomain)
    this.state = {
      data,
      scale: {
        type: ScaleType.Linear,
        domain: [+minDomain, +maxDomain],
        // nice: false
      },
    }

    this.dataSet = {
      oneDay,
      oneMonth,
      oneYear,
      threeMonth,
      twoDay,
      zero,
    }
  }

  render() {
    return (
      <View style={{ marginTop: 100, marginLeft: 10 }}>
        <Chart
          data={this.state.data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [10, 50, 0, 20] }}
          scale={{
            price: {
              type: ScaleType.Linear,
              domain: [670, 1000],
            },
            date: {
              type: ScaleType.Time,
              range: [0.05, 0.95], // 这个是左右两边留出空白的比例值
            },
          }}
        >
          <Axis
            field="date"
            tickCount={6}
            lineStyle={{ strokeColor: '#aaa', strokeWidth: 0.5 }}
            tickLineStyle={{ strokeWidth: 0 }}
          />
          <Axis
            field="price"
            grid
            formatter={value => `${value} SGD`}
            lineStyle={{ strokeWidth: 0 }}
            tickLineStyle={{ strokeWidth: 0 }}
            gridLineStyle={{ strokeStyle: 'dashed', dashedStyle: [2] }}
          />
          <Area
            position="date*price"
            color={['orange']}
            style={{ fill: 'linear-gradient(90deg, #FFB802 0%, #F69113 50%)' }}
          />
          <Line position="date*price" color={['orange']} />
          <Tooltip
            crosshair
            crosshairsType="xy"
            crosshairStyle={{ strokeColor: 'orange', strokeWidth: 1, strokeStyle: 'solid' }}
            sticky
          />
        </Chart>
        <FlatList
          data={Object.keys(this.dataSet).map(key => ({ id: key, title: key }))}
          renderItem={({ item }: any) => (
            <Button
              title={item.title}
              onPress={() => {
                const { series: data, maxValue, minValue } = this.dataSet[item.title]
                const temp = new Big(maxValue).sub(new Big(minValue)).times(3)
                const maxDomain = new Big(maxValue).plus(temp) || 2500
                const minDomain = new Big(minValue).sub(temp)
                console.log('留上下buffer', temp, minValue, maxValue, minDomain, maxDomain)
                this.setState({
                  data,
                  scale: {
                    type: ScaleType.Linear,
                    domain: [Number(minDomain), Number(maxDomain)],
                  },
                })
              }}
            />
          )}
        />
      </View>
    )
  }
}
