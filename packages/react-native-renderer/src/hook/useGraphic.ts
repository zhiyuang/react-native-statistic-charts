import { useContext, useEffect, useState } from 'react'
import { Element } from 'react-native-statistic-charts-core'
import { ChartContext } from '../context'

export const useGraphic = (cid: string) => {
  const { observe, destory } = useContext(ChartContext)
  const [elements, setElements] = useState<Element[]>([])

  useEffect(() => {
    observe(cid, setElements)
  }, [cid])

  useEffect(() => () => destory(cid), [])

  return elements
}
