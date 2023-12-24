import React, { useContext, useEffect, useState } from 'react'
import isEqual from 'lodash-es/isEqual'
import { ChartComponent, Element, DynamicElement } from 'react-native-statistic-charts-core'
import { ChartContext } from '../context'
import { ElementRenderer } from './Element'
import { DynamicElementRenderer } from './DynamicElement'

interface BaseComponentState {
  elements: Element[]
}

export abstract class BaseComponent<P> extends React.PureComponent<P, BaseComponentState> {
  abstract component: ChartComponent

  static contextType = ChartContext

  state: BaseComponentState = { elements: [] }

  componentDidMount() {
    this.context.observe(this.component.id, (elements: Element[]) => this.setState({ elements }))
  }

  componentDidUpdate(prevProps: P) {
    if (!isEqual(prevProps, this.props)) {
      this.component.update(this.props)
      this.context.repaint(this.component.id)
    }
  }

  componentWillUnmount() {
    this.context.destory(this.component.id)
  }

  render() {
    return this.state.elements?.map(element =>
      'dynamicShapes' in element ? (
        <DynamicElementRenderer key={element.eid} element={element as DynamicElement} />
      ) : (
        <ElementRenderer key={element.eid} element={element} />
      )
    )
  }
}

export const BaseComponentFC: React.FC<{ component: ChartComponent }> = React.memo(({ component }) => {
  const { observe, destory } = useContext(ChartContext)
  const [elements, setElements] = useState<Element[]>([])

  useEffect(() => {
    observe(component.id, setElements)
  }, [component.id])

  useEffect(() => () => destory(component.id), [])

  return (
    <>
      {elements.map(element =>
        'dynamicShapes' in element ? (
          <DynamicElementRenderer key={element.eid} element={element as DynamicElement} />
        ) : (
          <ElementRenderer key={element.eid} element={element} />
        )
      )}
    </>
  )
})
