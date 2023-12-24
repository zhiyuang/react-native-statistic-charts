import { GraphicOptions } from '@/types/chart'
import { Axis } from '@/guide/axis'
import { Chart } from '.'
import { ComponentType } from './component'
import { Point } from '@/types'

interface LayoutManagerOptions {
  layoutWidth: number
  layoutHeight: number
  padding?: [number, number, number, number]
}

export class LayoutManager {
  private layoutWidth = 0
  private layoutHeight = 0
  private layoutPadding: [number, number, number, number] = [0, 0, 0, 0]
  private layoutMap: Record<string, GraphicOptions> = {}
  public origin: Point = { x: 0, y: 0 }

  constructor(options?: LayoutManagerOptions) {
    if (options) {
      this.update(options)
    }
  }

  update(options: LayoutManagerOptions) {
    this.layoutWidth = options.layoutWidth
    this.layoutHeight = options.layoutHeight
    if (options.padding) {
      this.layoutPadding = options.padding
    }
    this.origin = { x: 0, y: this.layoutHeight }
  }

  layout(chart: Chart) {
    // layout order: outter to inner
    // (title?scrollbar? ->) legend -> axis -> geometry -> guide
    // const layoutOrder = {
    //   [ComponentType.Legend]: 0,
    // }

    // current layout position
    // record by order of top, right, bottom, left
    const layoutPosition = [...this.layoutPadding]
    chart.getComponentsByType<Axis>(ComponentType.Axis).forEach(axis => {
      const [top, right, bottom, left] = axis.layout(chart)
      if (axis.axisType === 'x') {
        this.updateLayout(axis.id, {
          origin: { x: layoutPosition[3], y: this.layoutHeight - layoutPosition[2] - bottom },
          width: left,
          height: bottom,
        })
        layoutPosition[2] += bottom
        layoutPosition[0] += top
      } else {
        this.updateLayout(axis.id, {
          origin: { x: layoutPosition[3], y: layoutPosition[0] },
          width: left,
          height: bottom,
        })
        layoutPosition[3] += left
        layoutPosition[1] += right
      }
    })

    // identify graphic area width
    const graphicOrigin = { x: layoutPosition[3], y: layoutPosition[0] }
    const graphicWidth = this.layoutWidth - layoutPosition[1] - layoutPosition[3]
    const graphicHeight = this.layoutHeight - layoutPosition[0] - layoutPosition[2]

    // update origin
    this.origin = { x: graphicOrigin.x, y: graphicOrigin.y + graphicHeight }
    chart.coord.update({ origin: graphicOrigin, width: graphicWidth, height: graphicHeight })

    // update axis, geometry, guide layout
    chart.components
      .filter(component =>
        new RegExp(
          `^[${[
            ComponentType.Axis,
            ComponentType.Geometry,
            ComponentType.Tooltip,
            ComponentType.GuideLine,
            ComponentType.GuidePoint,
            ComponentType.GuideLabel,
          ].join('')}]`
        ).test(component.id)
      )
      .forEach(component => {
        this.updateLayout(component.id, { origin: graphicOrigin, width: graphicWidth, height: graphicHeight })
      })
  }

  updateLayout(cid: string, layout: Partial<GraphicOptions>) {
    this.layoutMap[cid] = { ...this.layoutMap[cid], ...layout }
  }

  get(cid: string) {
    return this.layoutMap[cid]
  }
}
