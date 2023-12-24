import React, { useEffect, useState } from 'react'
import { BasicShape, DynamicElement, InteractionEvent } from 'react-native-statistic-charts-core'
import { useListenInteraction } from '../hook/useInteraction'
import { ElementRenderer } from './Element'

export const DynamicElementRenderer: React.FC<{ element: DynamicElement }> = React.memo(({ element }) => {
  const [interaction, setInteraction] = useState<InteractionEvent>()
  const [shapes, setShapes] = useState<BasicShape[]>([])

  useListenInteraction(setInteraction)

  useEffect(() => {
    if (interaction) {
      setShapes(element.dynamicShapes(interaction))
    } else {
      setShapes([])
    }
  }, [interaction])

  return <ElementRenderer element={{ ...element, shapes }} />
})
