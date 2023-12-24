import React, { useMemo } from 'react'
import { Element, DynamicElement } from 'react-native-statistic-charts-core'
import { ElementRenderer } from '../base/Element'
import { DynamicElementRenderer } from '../base/DynamicElement'

/**
 * default renderer
 *
 * @param {Element[]} elements
 * @returns
 */
export const useRenderer = (elements: Element[]) => {
  const svgElements = useMemo(
    () =>
      elements.map(element =>
        'dynamicShapes' in element ? (
          <DynamicElementRenderer key={element.eid} element={element as DynamicElement} />
        ) : (
          <ElementRenderer key={element.eid} element={element} />
        )
      ),
    [elements]
  )

  return svgElements
}
