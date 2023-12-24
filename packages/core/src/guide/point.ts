import merge from 'lodash-es/merge'
import { GraphicOptions } from '@/types/chart'
import { Element } from '@/types/geometry'
import { GuidePointOptions } from '@/types/guide'
import { DEFAULT_COLORS } from '@/const/color'
import { Chart } from '@/chart'
import { ComponentType } from '@/chart/component'

import { Guide } from './abstract'
import { Aesthetic } from './aesthetic'

export class GuidePoint extends Guide {
  animatable = false

  options!: GuidePointOptions
  defaultOptions: Partial<GuidePointOptions> = {
    size: 2,
    style: {
      fill: DEFAULT_COLORS[0],
    },
  }

  constructor(chart: Chart, options: GuidePointOptions) {
    super(chart, ComponentType.GuidePoint)
    this.update(options)
  }

  update(options: GuidePointOptions): void {
    this.options = merge(this.defaultOptions, options)
  }

  graphic(chart: Chart, graphicOptions: GraphicOptions): Element[] {
    const aesthetic = new Aesthetic(chart, graphicOptions)
    const center = aesthetic.position(this.options.position)

    return [
      {
        cid: this.id,
        eid: this.id,
        shapes: [
          {
            type: 'circle',
            center,
            radius: this.options.size!,
            ...this.options.style,
          },
        ],
      },
    ]
  }
}
