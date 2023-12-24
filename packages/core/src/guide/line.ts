import merge from 'lodash-es/merge'
import { GraphicOptions } from '@/types/chart'
import { Element } from '@/types/geometry'
import { GuideLineOptions } from '@/types/guide'
import { LINE_COLOR } from '@/const/color'
import { Chart } from '@/chart'
import { ComponentType } from '@/chart/component'
import { Guide } from './abstract'
import { Aesthetic } from './aesthetic'

export class GuideLine extends Guide {
  animatable = false

  options!: GuideLineOptions
  defaultOptions: Partial<GuideLineOptions> = {
    style: {
      strokeWidth: 1,
      strokeColor: LINE_COLOR,
    },
  }

  constructor(chart: Chart, options: GuideLineOptions) {
    super(chart, ComponentType.GuideLine)
    this.update(options)
  }

  update(options: GuideLineOptions): void {
    this.options = merge(this.defaultOptions, options)
  }

  graphic(chart: Chart, graphicOptions: GraphicOptions): Element[] {
    const aesthetic = new Aesthetic(chart, graphicOptions)
    const from = aesthetic.position(this.options.start)
    const to = aesthetic.position(this.options.end)

    return [
      {
        cid: this.id,
        eid: this.id,
        shapes: [
          {
            type: 'line',
            from,
            to,
            ...this.options.style,
          },
        ],
      },
    ]
  }
}
