import React from 'react'
import { View, Dimensions, Button } from 'react-native'
import { Chart, Axis, Tooltip, Line, ScaleType } from 'react-native-statistic-charts'

const data = [
  {
    value: 1679.0902,
    date: '2022-09-12',
  },
  {
    value: 1694.4273,
    date: '2022-09-13',
  },
  {
    value: 1685.7196,
    date: '2022-09-14',
  },
  {
    value: 1702.986,
    date: '2022-09-15',
  },
  {
    value: 1670.2363,
    date: '2022-09-16',
  },
  {
    value: 1674.7055,
    date: '2022-09-19',
  },
  {
    value: 1669.8012,
    date: '2022-09-20',
  },
  {
    value: 1667.3918,
    date: '2022-09-21',
  },
  {
    value: 1678.5604,
    date: '2022-09-22',
  },
  {
    value: 1666.0929,
    date: '2022-09-23',
  },
  {
    value: 1649.2854,
    date: '2022-09-26',
  },
  {
    value: 1648.5245,
    date: '2022-09-27',
  },
  {
    value: 1636.3409,
    date: '2022-09-28',
  },
  {
    value: 1629.3727,
    date: '2022-09-29',
  },
  {
    value: 1632.0091,
    date: '2022-09-30',
  },
  {
    value: 1629.3815,
    date: '2022-10-03',
  },
  {
    value: 1647.6391,
    date: '2022-10-04',
  },
  {
    value: 1645.6802,
    date: '2022-10-05',
  },
  {
    value: 1649.0649,
    date: '2022-10-06',
  },
  {
    value: 1640.4789,
    date: '2022-10-07',
  },
  {
    value: 1621.9351,
    date: '2022-10-10',
  },
  {
    value: 1616.4551,
    date: '2022-10-11',
  },
]

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
  
  render() {
    return (
      <View style={{ paddingTop: 100, height: Dimensions.get('window').height, backgroundColor: 'white' }}>
        <Chart
          data={data}
          style={{ width: Dimensions.get('window').width, height: 250, padding: [10, 20, 0, 20] }}
          scale={{
            date: { type: ScaleType.TimeCategory, range: this.state.rangeX },
            value: { type: ScaleType.Linear, range: this.state.rangeY, tickCount: 6 },
          }}
        >
          <Axis
            field="date"
          />
          <Axis field="value" lineStyle={{ strokeWidth: 0 }} tickLineStyle={{ strokeWidth: 0 }} grid />
          <Line position="date*value" />
          <Tooltip
            crosshair
            crosshairsType="x"
            crosshairStyle={{ strokeColor: 'orange', strokeWidth: 2, strokeStyle: 'solid' }}
            sticky
          />
        </Chart>
        <View>
          <Button
            title="Set X Range"
            onPress={() => {
              if (this.state.rangeX[0] === 0) {
                this.setState({ rangeX: [0.25, 0.75] })
              } else {
                this.setState({ rangeX: [0, 1] })
              }
            }}
          />
          <Button
            title="Set Y Range"
            onPress={() => {
              if (this.state.rangeY[0] === 0) {
                this.setState({ rangeY: [0.25, 0.75] })
              } else {
                this.setState({ rangeY: [0, 1] })
              }
            }}
          />
        </View>
      </View>
    )
  }
}
