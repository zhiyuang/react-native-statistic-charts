import merge from 'lodash-es/merge'
import { GraphicOptions } from '@/types/chart'
import { Element } from '@/types/geometry'
import { GuideLabelOptions, PlacementPosition } from '@/types/guide'
import { DEFAULT_COLORS } from '@/const/color'
import { Chart } from '@/chart'
import { ComponentType } from '@/chart/component'
import { Guide } from './abstract'
import { Aesthetic } from './aesthetic'
import { measureText } from '../utils/text'
import { getLabelArrowPoints, getLabelRectBBox } from '@/utils/label'
import { generateSVGPath } from '@/utils/svg'
import { getRectPoints } from '../utils/label'
import { Point } from '../types/geometry'

export class GuideLabel extends Guide {
  animatable = false

  options!: GuideLabelOptions
  defaultOptions: Partial<GuideLabelOptions> = {
    placement: PlacementPosition.Left,
    labelStyle: {
      fill: DEFAULT_COLORS[0],
      padding: [0, 0, 0, 0] as [number, number, number, number],
      offset: 4,
      rect: { radius: 2 },
      arrow: { base: 5, height: 5 },
    },
    textStyle: { fontSize: 10, lineHeight: 1.2, color: '#fff' },
    formatter: () => '',
  }

  constructor(chart: Chart, options: GuideLabelOptions) {
    super(chart, ComponentType.GuideLabel)
    this.update(options)
  }

  update(options: GuideLabelOptions): void {
    this.options = merge(this.defaultOptions, options)
  }

  private getPlacement(point: Point, graphicOptions: GraphicOptions) {
    return typeof this.options.placement === 'function'
      ? this.options.placement(point, graphicOptions)
      : this.options.placement!
  }

  graphic(chart: Chart, graphicOptions: GraphicOptions): Element[] {
    const aesthetic = new Aesthetic(chart, graphicOptions)
    const { padding, rect = {}, offset, arrow, ...labelStyle } = this.options.labelStyle!
    const textStyle = this.options.textStyle!
    const record = this.options.position
    const text = this.options.formatter(record)
    const guideOrigin = aesthetic.position(record)
    const placement = this.getPlacement(guideOrigin, graphicOptions)
    const textSize = measureText(text, textStyle)
    const width = rect?.width ?? textSize.width + padding![1] + padding![3]
    const height = rect?.height ?? Math.max(textSize.height, textStyle.lineHeight!) + padding![0] + padding![2]
    const bbox = getLabelRectBBox(placement!, guideOrigin, offset!, width, height, rect.radius!, arrow)
    const arrowPoints = getLabelArrowPoints(placement!, guideOrigin, offset!, arrow!.base, arrow!.height)
    const origin = bbox.origin

    return [
      {
        cid: this.id,
        eid: this.id,
        record,
        bbox,
        shapes: [
          {
            type: 'rect',
            origin,
            width,
            height,
            radius: rect.radius,
            ...labelStyle,
            points: getRectPoints(bbox),
          },
          {
            type: 'path',
            d: generateSVGPath(arrowPoints, true),
            ...labelStyle,
            points: arrowPoints,
          },
          {
            type: 'text',
            position: { x: origin.x + width / 2, y: origin.y + height / 2 },
            align: 'center',
            verticalAlign: 'middle',
            text: Array.isArray(text) ? text : [text ?? ''],
            ...this.options.textStyle,
          },
        ],
      },
    ]
  }
}
