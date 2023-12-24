import isEqual from 'lodash-es/isEqual'
import { Element } from 'react-native-statistic-charts-core'

export class GraphicManager {
  private graphics: Record<string, Element[]> = {}
  private observer: Record<string, (elements: Element[]) => void> = {}

  createGraphicsMap(elements: Element[]) {
    return elements.reduce<Record<string, Element[]>>(
      (res, element) => ({ ...res, [element.cid]: [...(res[element.cid] ?? []), element] }),
      {}
    )
  }

  update(elements: Element[]): void
  update(cid: string, elements: Element[]): void
  update(...args: [string | Element[], Element[]?]) {
    if (typeof args[0] === 'string') {
      const [cid, elements] = args
      if (isEqual(this.graphics[cid], elements)) return
      this.graphics[cid] = elements ?? []
      this.notify(cid)
    } else {
      const elements = args[0]
      const graphics = this.createGraphicsMap(elements)

      Object.entries(graphics).forEach(([cid, elements]) => {
        if (isEqual(this.graphics[cid], elements)) return
        this.graphics[cid] = elements
        this.notify(cid)
      })
    }
  }

  observe(cid: string, cb: (elements: Element[]) => void) {
    this.observer[cid] = cb

    return () => {
      delete this.observer[cid]
    }
  }

  notify(cid: string) {
    this.observer[cid]?.(this.graphics[cid] ?? [])
  }
}
