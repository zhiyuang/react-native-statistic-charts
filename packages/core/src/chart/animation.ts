import { Chart, ChartOptions } from '@/types'
import { Element } from '@/types/geometry'
import { generateSVGPath } from '@/utils/svg'

export class AnimationManager {
  private options?: ChartOptions['animation']
  private chart: Chart

  constructor(chart: Chart) {
    this.chart = chart
  }

  update(options?: ChartOptions['animation']) {
    this.options = options
  }

  fillUpOriginShapes(ele: Element) {
    let length = 2
    if (ele.shapes[0]?.type === 'path') {
      length = (ele.shapes[0]?.d.match(/M|L/g) || []).length
    }

    return ele.shapes.map(shape => ({
      ...shape,
      d: generateSVGPath(Array(length).fill(this.chart.layoutManager.origin), length > 2),
    }))
  }

  findLastElement(cid: string, eid: string, prev: Element[]) {
    return prev
      .filter(el => el.cid === cid && el.eid.split('-').length === eid.split('-').length) // TODO: find better way to check element id
      .sort(el => (el.eid.split('-')[1] > eid.split('-')[1] ? 1 : -1))[0]
  }

  composeAnimation(cur: Element[], prev: Element[]) {
    if (prev.length === 0 && this.options?.enter) {
      // entering animation
      return cur.map(element => ({
        ...element,
        prevShapes: this.fillUpOriginShapes(element),
        animating: true,
        animateOptions: this.options?.enter,
      }))
    } else if (prev.length !== 0 && this.options?.update) {
      // update animation
      return cur.map(element => {
        const prevElement = prev.find(pre => pre.eid === element.eid)
        let prevShapes = prevElement?.shapes

        if (!prevShapes && this.options?.update?.type === 'gradual') {
          prevShapes = this.findLastElement(element.cid, element.eid, prev).shapes
        }

        return {
          ...element,
          prevShapes,
          animating: !!prevShapes,
          animateOptions: this.options?.update,
        }
      })
    }
    return cur
  }
}
