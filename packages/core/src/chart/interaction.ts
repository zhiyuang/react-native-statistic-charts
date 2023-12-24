import throttle from 'lodash-es/throttle'
import { Element, Point } from '@/types/geometry'
import { InteractionManagerOptions, TouchEvent, InteractionState, InteractionEvent } from '@/types/interaction'

export class InteractionManager {
  private touch: Point | null = null

  private interactiveElements: Element[] = []
  private state: Map<string, InteractionState> = new Map()
  private subscriber: Map<string, Array<(state: InteractionState) => void>> = new Map()
  private listener: Array<(interaction: InteractionEvent) => void> = []

  update(options: InteractionManagerOptions) {
    this.interactiveElements = options.interactiveElements
    this.state = new Map(
      this.interactiveElements.map(element => [element.eid, this.state.get(element.eid) ?? 'default'])
    )
  }

  private updateState() {
    // check each element interactive state
    this.interactiveElements.forEach(element => {
      let state: InteractionState = this.state.get(element.eid) ?? 'default'

      if (!this.touch) {
        state = state === 'active' ? 'default' : state
      } else if (typeof element.interaction?.bound === 'function') {
        state = element.interaction?.bound(this.touch) ? 'active' : 'default'
      } else if (element.interaction?.bound) {
        const { x, y } = this.touch
        const [minX, minY, maxX, maxY] = element.interaction.bound
        state = x >= minX && x <= maxX && y >= minY && y <= maxY ? 'active' : 'default'
      }

      if (state !== this.state.get(element.eid)) {
        this.state.set(element.eid, state)
        this.notify(element.eid, state)
      }
    })
  }

  createEventSource<E>(transformer: (event: E) => TouchEvent) {
    return (event: E) => this.dispatch(transformer(event))
  }

  // whether touchMove event could be fired after touchEnd event?
  // could be miss touchEnd event in some case?
  dispatch = throttle((event: TouchEvent) => {
    if (event.type === 'touchEnd') {
      this.touch = null
    } else {
      this.touch = { x: event.locationX, y: event.locationY }
    }

    this.updateState()

    this.listener.forEach(cb => cb({ touch: this.touch, activeElements: this.activeElements }))
  }, 16)

  listen(cb: (interaction: InteractionEvent) => void) {
    this.listener.push(cb)

    return () => {
      const index = this.listener.indexOf(cb)
      if (index) {
        this.listener!.splice(index, 1)
      }
    }
  }

  subscript(eid: string, cb: (state: InteractionState) => void) {
    if (!this.subscriber.get(eid)) {
      this.subscriber.set(eid, [])
    }
    this.subscriber.get(eid)!.push(cb)

    return () => {
      const index = this.subscriber.get(eid)?.indexOf(cb)
      if (index) {
        this.subscriber.get(eid)!.splice(index, 1)
      }
    }
  }

  private notify(eid: string, state: InteractionState) {
    this.subscriber.get(eid)?.forEach(cb => cb(state))
  }

  get activeElements() {
    return this.interactiveElements.filter(element => this.state.get(element.eid) === 'active')
  }
}
