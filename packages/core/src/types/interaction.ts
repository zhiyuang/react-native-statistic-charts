import { Point, Element } from './geometry'

export type EventType = 'touchStart' | 'touchMove' | 'touchEnd'

export type TouchEvent = {
  type: EventType
  locationX: number
  locationY: number
  ts: number
}

export type InteractionState = 'default' | 'active' | 'selected'

export type InteractionEvent = {
  touch: Point | null
  activeElements: Element[]
}

export interface InteractionManagerOptions {
  // chartWidth: number
  // chartHeight: number
  interactiveElements: Element[]
}
