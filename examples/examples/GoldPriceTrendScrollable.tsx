import React from 'react'
import { Dimensions, StyleSheet, View, Text, ScrollView } from 'react-native'
import { Chart, Axis, Tooltip, Area, GuidePoint, Point, TooltipOptions, DataRecord } from 'react-native-statistic-charts'

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
      price: 9240000,
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

  transactionData = ['2022-03-25', '2022-04-14']

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
      <>
        <ScrollView scrollEventThrottle={16} scrollEnabled>
          <View style={{ height: 600 }}></View>
          <View style={styles.priceBar}>
            <Text style={styles.priceBarDate}>{this.state.selected.date}</Text>
            <Text style={styles.priceBarPrice}>{this.state.selected.price / 10000}rp</Text>
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
              formatter={value => `${+value / 10000} rp`}
              lineStyle={{ strokeWidth: 0 }}
              tickLineStyle={{ strokeWidth: 0 }}
              gridLineStyle={{ strokeStyle: 'dashed', dashedStyle: [2] }}
            />
            <Area
              position="date*price"
              color={[themeColor]}
              style={{ fill: 'linear-gradient(90deg, #FFB802 0%, #FFFDF8 100%)' }}
            />
            <Point position="date*price" color={[themeColor]} size={{ value: record => (record.tag ? 4 : 0) }} />
            {this.transactionData.map(date => (
              <GuidePoint
                key={date}
                position={{ date, price: this.data.find(data => data.date === date)!.price }}
                size={4}
                style={{ fill: themeColor, strokeColor: '#fff', strokeWidth: 1 }}
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
            {this.state.active && this.transactionData.includes(this.state.selected.date) && (
              <View
                style={[
                  styles.customTips,
                  {
                    flexDirection: this.state.activePoint.x > windowWidth * 0.6 ? 'row-reverse' : 'row',
                    top: this.state.activePoint.y,
                  },
                  this.state.activePoint.x > windowWidth * 0.6
                    ? { right: windowWidth - this.state.activePoint.x }
                    : { left: this.state.activePoint.x },
                ]}
              >
                <View
                  style={[
                    styles.customTipsArrow,
                    this.state.activePoint.x > windowWidth * 0.6 ? styles.rightArrow : styles.leftArrow,
                  ]}
                />
                <Text style={styles.customTipsText}>buy</Text>
              </View>
            )}
          </Chart>
          <View style={{ height: 600 }}></View>
        </ScrollView>
      </>
    )
  }
}
