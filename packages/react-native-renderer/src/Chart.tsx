import React, { PropsWithChildren } from 'react'
import { View, GestureResponderEvent, PanResponder, PanResponderInstance, Platform } from 'react-native'
import Svg from 'react-native-svg'
import isEqual from 'lodash-es/isEqual'
import { ChartOptions, Element, EventType } from 'react-native-statistic-charts-core'
import { Chart } from 'react-native-statistic-charts-core'
import { ChartContext } from './context'
import { GraphicManager } from './base/GraphicManager'

const createEventTransformer = (type: EventType) => (event: GestureResponderEvent) => ({
  type,
  locationX: event.nativeEvent.locationX,
  locationY: event.nativeEvent.locationY,
  ts: Date.now(),
})

export class ChartComponent extends React.Component<ChartOptions, { customComponent: React.ReactNode }> {
  private chart
  private chartContext: React.ContextType<typeof ChartContext>
  private graphic
  private onTouchMove
  private onTouchEnd
  private isTouching: boolean
  private isGranting: boolean
  private _panResponder: PanResponderInstance
  constructor(props: PropsWithChildren<ChartOptions>) {
    super(props)
    this.isTouching = false
    this.isGranting = false
    this.chart = new Chart(props)
    this.graphic = new GraphicManager()
    this.chartContext = {
      chart: this.chart,
      observe: (cid: string, cb: (elements: Element[]) => void) => {
        this.graphic.observe(cid, cb)
      },
      repaint: (cid: string, layout?: boolean) => {
        const elements = this.chart.graphic(cid, layout).filter(element => (cid ? element.cid === cid : true))
        cid ? this.graphic.update(cid, elements) : this.graphic.update(elements)
      },
      destory: (cid: string) => {
        this.chart.remove(cid)
        this.graphic.update(cid, [])
      },
      setCustomComponent: comp => {
        this.setState({ customComponent: comp })
      },
    }
    this.state = {
      customComponent: null,
    }

    this.onTouchMove = this.chart.interactionManager.createEventSource(createEventTransformer('touchMove'))
    this.onTouchEnd = this.chart.interactionManager.createEventSource(createEventTransformer('touchEnd'))
    this._panResponder = PanResponder.create({
      onPanResponderReject: () => {
        this.isGranting = false
        this.isTouching = false
      },
      onPanResponderGrant: () => {
        this.isGranting = true
      },
      onStartShouldSetPanResponderCapture: e => {
        this.isTouching = true
        this.onTouchMove(e)
        return false
      },
      onStartShouldSetPanResponder: e => {
        if (Platform.OS !== 'ios' && this.isTouching && !this.isGranting) {
          //处理 ios 下的点击事件
          this.onTouchEnd(e)
        }
        return Platform.OS === 'ios'
      },
      onPanResponderStart: e => {
        this.isTouching = true
        this.onTouchMove(e)
      },
      onMoveShouldSetPanResponderCapture: e => {
        this.isTouching = true
        this.onTouchMove(e)
        return false
      },
      onMoveShouldSetPanResponder: (e, g) => {
        this.isGranting = Math.abs(g.dx) >= Math.abs(g.dy)
        return Platform.OS === 'ios' ? this.isTouching && this.isGranting : this.isTouching
      },
      onPanResponderMove: e => {
        this.isTouching = true
        this.onTouchMove(e)
      },
      onPanResponderTerminationRequest: () => {
        this.isGranting = false
        return false
      },
      onPanResponderRelease: e => {
        this.onTouchEnd(e)
        this.isGranting = true
        this.isTouching = false
      },
      onPanResponderTerminate: e => {
        this.onTouchEnd(e)
        this.isGranting = false
        this.isTouching = false
      },
      onPanResponderEnd: e => {
        this.onTouchEnd(e)
        this.isGranting = false
        this.isTouching = false
      },
    })
  }

  componentDidMount() {
    this.generateGraphic()
    this.chart.getOptions().onLoad?.()
  }

  componentDidUpdate(prevProps: PropsWithChildren<ChartOptions>) {
    const { children: _, ...prevChartOptions } = prevProps
    const { children: __, ...chartOptions } = this.props
    if (!isEqual(prevChartOptions, chartOptions)) {
      this.chart.update(this.props)
      this.generateGraphic()
    }
  }

  private generateGraphic() {
    const elements = this.chart.graphic()
    this.graphic.update(elements)
  }

  render() {
    const {
      children,
      style: { width, height },
    } = this.props

    return (
      <ChartContext.Provider value={this.chartContext}>
        <View
          style={[
            { alignItems: 'center', justifyContent: 'center' },
            { height, width },
          ]}
          {...this._panResponder.panHandlers}
        >
          <Svg height={height} width={width}>
            {children}
          </Svg>
        </View>
        {this.state.customComponent}
      </ChartContext.Provider>
    )
  }
}
