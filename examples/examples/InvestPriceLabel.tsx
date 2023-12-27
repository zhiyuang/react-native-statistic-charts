import React from 'react'
import { Dimensions, StyleSheet, View, Text } from 'react-native'
import {
  Chart,
  Axis,
  Tooltip,
  Area,
  GuideLabel,
  Point,
  TooltipOptions,
  DataRecord,
  GuidePoint,
  Line,
  PlacementPosition,
} from 'react-native-statistic-charts'

const windowWidth = Dimensions.get('window').width

const themeColor = 'orange'

const styles = StyleSheet.create({
  priceBar: {
    height: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBarDate: {
    fontSize: 16,
  },
  priceBarPrice: {
    fontSize: 16,
    color: themeColor,
  },
  customTips: {
    height: 18,
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateY: -9 }],
  },
  customTipsArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  leftArrow: {
    borderTopColor: 'transparent',
    borderRightColor: themeColor,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  rightArrow: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: themeColor,
  },
  customTipsText: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: themeColor,
    borderRadius: 2,
    overflow: 'hidden',
    color: '#fff',
    fontSize: 10,
  },
})

export default class GoldPriceDemo extends React.Component<
  null,
  { active: boolean; activePoint: { x: number; y: number }; selected: DataRecord }
> {
  data = [
    {
      date: '2022-03-16',
      price: 9220000,
    },
    {
      date: '2022-03-17',
      price: 9220000,
    },
    {
      date: '2022-03-18',
      price: 9270000,
    },
    {
      date: '2022-03-19',
      price: 9170000,
    },
    {
      date: '2022-03-20',
      price: 9170000,
    },
    {
      date: '2022-03-21',
      price: 9170000,
    },
    {
      date: '2022-03-22',
      price: 9220000,
    },
    {
      date: '2022-03-23',
      price: 9180000,
    },
    {
      date: '2022-03-24',
      price: 9290000,
    },
    {
      date: '2022-03-25',
      price: 9370000,
    },
    {
      date: '2022-03-26',
      price: 9360000,
    },
    {
      date: '2022-03-27',
      price: 9360000,
    },
    {
      date: '2022-03-28',
      price: 9300000,
    },
    {
      date: '2022-03-29',
      price: 9230000,
    },
    {
      date: '2022-03-30',
      price: 9200000,
    },
    {
      date: '2022-03-31',
      price: 9220000,
    },
    {
      date: '2022-04-01',
      price: 9240000,
    },
    {
      date: '2022-04-02',
      price: 9220000,
    },
    {
      date: '2022-04-03',
      price: 9220000,
    },
    {
      date: '2022-04-04',
      price: 9220000,
    },
    {
      date: '2022-04-05',
      price: 9240000,
    },
    {
      date: '2022-04-06',
      price: 9210000,
    },
    {
      date: '2022-04-07',
      price: 9210000,
    },
    {
      date: '2022-04-08',
      price: 9230000,
    },
    {
      date: '2022-04-09',
      price: 9320000,
    },
    {
      date: '2022-04-10',
      price: 9320000,
      txnType: 2,
    },
    {
      date: '2022-04-11',
      price: 9320000,
    },
    {
      date: '2022-04-12',
      price: 9340000,
    },
    {
      date: '2022-04-13',
      price: 9390000,
    },
    {
      date: '2022-04-14',
      price: 9430000,
    },
  ]

  transactionData: any[] = [
    {
      date: '2022-03-16',
      price: 9220000,
      txnType: 1,
      adjust: PlacementPosition.Left,
    },
    {
      date: '2022-03-17',
      price: 9220000,
      txnType: 2,
      adjust: PlacementPosition.LeftTop,
    },
    {
      date: '2022-03-18',
      price: 9270000,
      txnType: 2,
      adjust: PlacementPosition.LeftBottom,
    },

    {
      date: '2022-03-21',
      price: 9170000,
      txnType: 1,
      adjust: PlacementPosition.BottomRight,
    },
    {
      date: '2022-03-22',
      price: 9220000,
      txnType: 2,
      adjust: PlacementPosition.Bottom,
    },

    {
      date: '2022-03-25',
      price: 9370000,
      txnType: 2,
      adjust: PlacementPosition.Top,
    },
    {
      date: '2022-03-26',
      price: 9360000,
      txnType: 2,
      adjust: PlacementPosition.TopRight,
    },
    {
      date: '2022-03-29',
      price: 9230000,
      txnType: 1,
      adjust: PlacementPosition.RightTop,
    },
    {
      date: '2022-04-09',
      price: 9320000,
      txnType: 1,
      adjust: PlacementPosition.BottomLeft,
    },
    {
      date: '2022-04-10',
      price: 9320000,
      txnType: 1,
      adjust: PlacementPosition.Right,
    },
    {
      date: '2022-04-12',
      price: 9340000,
      txnType: 2,
      adjust: PlacementPosition.RightBottom,
    },
  ]

  state = { active: false, activePoint: { x: 0, y: 0 }, selected: this.data[this.data.length - 1] }

  onChange: TooltipOptions['onChange'] = ({ origin, data }) => {
    this.setState({
      active: true,
      activePoint: origin,
      selected: data[0].record,
    })
  }

  onHide = () => {
    this.setState({ active: false })
  }

  render() {
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <View style={styles.priceBar}>
          <Text style={styles.priceBarDate}>{this.state.selected.date}</Text>
          <Text style={styles.priceBarPrice}>{this.state.selected.price / 10000}</Text>
        </View>
        <Chart
          data={this.data}
          // scale={{ date: { type: ScaleType.Time, domain: [new Date('2017-06-05'), new Date('2017-07-31')] } }}
          style={{ width: windowWidth, height: 250, padding: [10, 20, 0, 20] }}
        >
          <Axis
            field="date"
            tickCount={7}
            formatter={value =>
              value instanceof Date
                ? value.toLocaleDateString('en-US', { formatMatcher: 'basic', month: 'short', day: '2-digit' })
                : ''
            }
            lineStyle={{ strokeColor: '#aaa' }}
            tickLineStyle={{ strokeColor: '#ccc' }}
          />
          <Axis
            field="price"
            grid
            tickCount={4}
            formatter={value => `${+value / 10000}  `}
            lineStyle={{ strokeWidth: 0 }}
            tickLineStyle={{ strokeWidth: 0 }}
            gridLineStyle={{ strokeStyle: 'dashed', dashedStyle: [2] }}
          />
          <Area position="date*price" color={[themeColor]} style={{ fill: '#FFB802', fillOpacity: 0.1 }} />
          <Line position="date*price" size={1} color={['#EDA500']} />
          <Point position="date*price" color={[themeColor]} size={{ value: record => (record.tag ? 4 : 0) }} />
          {this.transactionData.map(item => (
            <GuidePoint
              key={item.date}
              position={{ date: item.date, price: item.price }}
              size={4}
              style={{ fill: item.txnType === 1 ? '#26AA99' : '#EDA500', strokeColor: '#fff', strokeWidth: 1 }}
            />
          ))}
          {this.transactionData.slice(0, 2).map(item => (
            <GuideLabel
              key={item.date}
              position={item}
              labelStyle={{
                fill: item.txnType === 1 ? '#26AA99' : '#EDA500',
                offset: 4,
                rect: { width: 24, radius: 2 },
              }}
              placement={(pos: any, graphicOptions: any) =>
                pos.x - 20 < graphicOptions.origin.x ? PlacementPosition.TopRight : PlacementPosition.Left
              }
              formatter={() => (item.txnType === 1 ? 'Buy' : 'Sell')}
              textStyle={{ color: '#fff', fontSize: 10, lineHeight: 1.4 }}
            />
          ))}

          <Tooltip
            label={false}
            crosshair
            crosshairsType="x"
            crosshairStyle={{ strokeColor: themeColor, strokeWidth: 1, strokeStyle: 'solid' }}
            sticky
            onShow={this.onChange}
            onChange={this.onChange}
            onHide={this.onHide}
          />
        </Chart>
      </View>
    )
  }
}
