import * as React from 'react'
import { View, Text, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import LineDemo from './basic/Line/BasicLineChart'
import AreaDemo from './basic/Area/BasicAreaChart'
import MultiLineDemo from './basic/Radar/MultiLineChart'
import AdjustedIntervalDemo from './basic/Interval/AdjustedIntervalChart'
import BasicIntervalChart from './basic/Interval/BasicIntervalChart'
import AnimationDemo from './basic/Line/BasicAnimation'
import GoldPriceDemo from './examples/GoldPriceTrend'
import InvestPriceDemo from './examples/InvestPriceLabel'
import GoldPriceScrollableDemo from './examples/GoldPriceTrendScrollable'
import CustomTooltip from './basic/Others/CustomTooltip'
import PieChartDemo from './basic/Pie/BasicPieChart'
import StackedAreaDemo from './basic/Area/BasicStackedAreaChart'
import BasicIntervalDemo from './basic/Interval/BasicIntervalNegative'
import AreaAnimationDemo from './basic/Area/AreaAnimation'
import RadarAreaDemo from './basic/Radar/RadarAreaChart'
import BasicDonutDemo from './basic/Pie/BasicDonutChart'
import ScaleDemo from './basic/Others/Scale'
import IntervalAnimation from './basic/Interval/AnimationIntervalChart'
import FloatDemo from './basic/Others/Float'
import InvestDonut from './examples/InvestDonut'
import NegativeLine from './basic/Line/NegativeLine'
import NegativeArea from './basic/Area/NegativeArea'
import PointDemo from './basic/Point/BasicPoint'
import GroupedLine from './basic/Line/GroupedLineChart'
import InvestBar from './examples/InvestBar'
import OnePointArea from './basic/Area/OnePoint'

function HomeScreen({ navigation }: NativeStackScreenProps<any, any, any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Basic</Text>
      <Button title="Point" onPress={() => navigation.navigate('Point')} />
      <Button title="Line" onPress={() => navigation.navigate('Line')} />
      <Button title="Area" onPress={() => navigation.navigate('Area')} />
      <Button title="Interval" onPress={() => navigation.navigate('Interval')} />
      <Button title="Radar" onPress={() => navigation.navigate('Radar')} />
      <Button title="Pie" onPress={() => navigation.navigate('Pie')} />
      <Button title="Others" onPress={() => navigation.navigate('Others')} />
      <Text>Examples</Text>
      <Button title="Invest Price Chart" onPress={() => navigation.navigate('InvestPriceDemo')} />
      <Button title="Gold Price Chart" onPress={() => navigation.navigate('GoldPriceChart')} />
      <Button title="Gold Price Scrollable Chart" onPress={() => navigation.navigate('GoldPriceScrollableChart')} />
      <Button title="Invest Donut" onPress={() => navigation.navigate('InvestDonut')} />
      <Button title="Invest Bar" onPress={() => navigation.navigate('InvestBar')} />
    </View>
  )
}

function PointScreen({ navigation }: NativeStackScreenProps<any, any, any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Point Chart" onPress={() => navigation.navigate('PointDemo')} />
    </View>
  )
}

function LineScreen({ navigation }: NativeStackScreenProps<any, any, any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Line Chart" onPress={() => navigation.navigate('LineChart')} />
      <Button title="Animation Line Chart" onPress={() => navigation.navigate('AnimationChart')} />
      <Button title="Negative Line Chart" onPress={() => navigation.navigate('NegativeLine')} />
      <Button title="Grouped Line Chart" onPress={() => navigation.navigate('GroupedLine')} />
    </View>
  )
}

function AreaScreen({ navigation }: NativeStackScreenProps<any, any, any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Area Chart" onPress={() => navigation.navigate('AreaChart')} />
      <Button title="Statcked Area Chart" onPress={() => navigation.navigate('StackedArea')} />
      <Button title="Area Animation" onPress={() => navigation.navigate('AnimationArea')} />
      <Button title="Negative Area Chart" onPress={() => navigation.navigate('NegativeArea')} />
      <Button title="One Point Chart" onPress={() => navigation.navigate('OnePointArea')} />
    </View>
  )
}

function IntervalScreen({ navigation }: NativeStackScreenProps<any, any, any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Interval Chart" onPress={() => navigation.navigate('SimpleIntervalChart')} />
      <Button title="Interval Adjust Option" onPress={() => navigation.navigate('AdjustedIntervalChart')} />
      <Button title="Interval Negative" onPress={() => navigation.navigate('IntervalNegative')} />
      <Button title="Interval Animation" onPress={() => navigation.navigate('IntervalAnimation')} />
    </View>
  )
}

function PieScreen({ navigation }: NativeStackScreenProps<any, any, any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pie Chart" onPress={() => navigation.navigate('PieChart')} />
      <Button title="Donut Chart" onPress={() => navigation.navigate('DonutChart')} />
    </View>
  )
}

function RadarScreen({ navigation }: NativeStackScreenProps<any, any, any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Radar Chart" onPress={() => navigation.navigate('MultiLineChart')} />
      <Button title="Radar Area Chart" onPress={() => navigation.navigate('RadarArea')} />
    </View>
  )
}

function OthersScreen({ navigation }: NativeStackScreenProps<any, any, any>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Custom Tooltip" onPress={() => navigation.navigate('CustomTooltip')} />
      <Button title="Scale" onPress={() => navigation.navigate('Scale')} />
      <Button title="Float" onPress={() => navigation.navigate('Float')} />
    </View>
  )
}

const Stack = createNativeStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Point" component={PointScreen} />
        <Stack.Screen name="Line" component={LineScreen} />
        <Stack.Screen name="Area" component={AreaScreen} />
        <Stack.Screen name="Interval" component={IntervalScreen} />
        <Stack.Screen name="Pie" component={PieScreen} />
        <Stack.Screen name="Radar" component={RadarScreen} />
        <Stack.Screen name="Others" component={OthersScreen} />
        <Stack.Screen name="LineChart" component={LineDemo} />
        <Stack.Screen name="AreaChart" component={AreaDemo} />
        <Stack.Screen name="MultiLineChart" component={MultiLineDemo} />
        <Stack.Screen name="AdjustedIntervalChart" component={AdjustedIntervalDemo} />
        <Stack.Screen name="SimpleIntervalChart" component={BasicIntervalChart} />
        <Stack.Screen name="AnimationChart" component={AnimationDemo} />
        <Stack.Screen name="CustomTooltip" component={CustomTooltip} />
        <Stack.Screen name="PieChart" component={PieChartDemo} />
        <Stack.Screen name="StackedArea" component={StackedAreaDemo} />
        <Stack.Screen name="IntervalNegative" component={BasicIntervalDemo} />
        <Stack.Screen name="AnimationArea" component={AreaAnimationDemo} />
        <Stack.Screen name="RadarArea" component={RadarAreaDemo} />
        <Stack.Screen name="DonutChart" component={BasicDonutDemo} />
        <Stack.Screen name="InvestPriceDemo" component={InvestPriceDemo} />
        <Stack.Screen name="GoldPriceChart" component={GoldPriceDemo} />
        <Stack.Screen name="GoldPriceScrollableChart" component={GoldPriceScrollableDemo} />
        <Stack.Screen name="Scale" component={ScaleDemo} />
        <Stack.Screen name="IntervalAnimation" component={IntervalAnimation} />
        <Stack.Screen name="Float" component={FloatDemo} />
        <Stack.Screen name="InvestDonut" component={InvestDonut} />
        <Stack.Screen name="NegativeLine" component={NegativeLine} />
        <Stack.Screen name="NegativeArea" component={NegativeArea} />
        <Stack.Screen name="PointDemo" component={PointDemo} />
        <Stack.Screen name="GroupedLine" component={GroupedLine} />
        <Stack.Screen name="InvestBar" component={InvestBar} />
        <Stack.Screen name="OnePointArea" component={OnePointArea} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
