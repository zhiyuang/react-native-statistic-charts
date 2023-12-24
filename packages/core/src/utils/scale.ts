import type { Continuous, ContinuousOptions, Linear, Time } from '@antv/scale'
import { ScaleType } from '@/types/scale'
import type Scale from '@/scale'

export const isContinuesScale = (scale: any): scale is Continuous<ContinuousOptions> =>
  [ScaleType.Linear, ScaleType.Time].includes(scale?.type)

export const isLinearScale = (scale: any): scale is Linear => scale?.type === ScaleType.Linear

export const isTimeScale = (scale: any): scale is Time => scale?.type === ScaleType.Time

export const getAxisOrigin = (scale: Scale) => {
  const domain = scale.getOptions().domain ?? []
  return isLinearScale(scale) && domain[0] < 0 && domain[1] > 0 ? 0 : domain[0]
}
