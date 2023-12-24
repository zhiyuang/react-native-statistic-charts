import { useContext, useEffect, useState } from 'react'
import { InteractionState, InteractionEvent } from 'react-native-statistic-charts-core'
import { ChartContext } from '../context'

export const useListenInteraction = (listener: (interaction: InteractionEvent) => void) => {
  const { chart } = useContext(ChartContext)

  useEffect(() => chart?.interactionManager.listen(listener), [chart?.interactionManager])
}

export const useInteractionState = (eid: string) => {
  const { chart } = useContext(ChartContext)
  const [state, setState] = useState<InteractionState>('default')

  useEffect(() => chart?.interactionManager?.subscript(eid, setState), [chart?.interactionManager])

  return state
}
