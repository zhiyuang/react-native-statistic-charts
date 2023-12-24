import merge from 'lodash-es/merge'
import { GraphicOptions, DynamicElement, Geometry, Circle } from '@/types'
import { TooltipOptions } from '@/types/tooltip'
import { LINE_COLOR } from '@/const/color'
import { ChartComponent, ComponentType } from '@/chart/component'
import { nearest } from '@/utils/data'
import { measureText } from '@/utils/text'
import { Chart } from '@/chart'

export class Tooltip extends ChartComponent {
  animatable = false

  options!: TooltipOptions
  defaultOptions: Partial<TooltipOptions> = {
    sticky: true,
    shared: true,
    label: true,
    crosshair: false,
    tooltipMarker: true,
    crosshairsType: 'xy',
    crosshairStyle: {
      strokeWidth: 1,
      strokeColor: LINE_COLOR,
      strokeStyle: 'dashed',
    },
    containerStyle: {
      backgroundColor: '#202020',
      padding: [2, 4, 2, 4],
    },
    textStyle: {
      color: '#fff',
      fontSize: 12,
      lineHeight: 1.2,
    },
    tooltipMarkerStyle: { radius: 4, strokeColor: '#fff', strokeWidth: 1 },
  }
  private state: 'show' | 'hide' = 'hide'

  constructor(chart: Chart, options: TooltipOptions) {
    super(chart, ComponentType.Tooltip)
    this.update(options)
  }

  update(options: TooltipOptions): void {
    this.options = merge(this, this.defaultOptions, options)
  }

  graphic(chart: Chart, graphicOptions: GraphicOptions): DynamicElement[] {
    return [
      {
        cid: this.id,
        eid: `${this.id}-xtip`,
        shapes: [],
        dynamicShapes: ({ touch, activeElements }) => {
          if (!touch || (this.options.sticky && !activeElements.length)) {
            if (this.state === 'show') {
              this.options.onHide?.()
            }
            return []
          }

          const activeDataPoints = activeElements
            .map(element => {
              const yDim = chart
                .getComponentsByType<Geometry>(ComponentType.Geometry)
                .find(geometry => geometry.id === element.cid)?.yDim
              return yDim
                ? {
                    field: yDim,
                    value: element.record![yDim],
                    record: element.record!,
                    origin: element.interaction!.origin!,
                    fill: function() {
                      const shape = element.shapes.find(shape => shape.strokeColor || shape.fill)
                      return shape?.fill || shape?.strokeColor
                    }()
                  }
                : null
            })
            .filter((res): res is NonNullable<typeof res> => !!res)
          const nearestDataPoint = nearest(
            touch,
            activeDataPoints.map(({ origin }) => origin)
          )
          const showedDataPoints = this.options.shared
            ? activeDataPoints
            : activeDataPoints.filter(
                ({ origin }) => origin?.x === nearestDataPoint?.x && origin?.y === nearestDataPoint?.y
              )!
          const tooltipContent = showedDataPoints.map(
            ({ field, value, record }) => this.options.formatter?.(field, value!, record!) ?? `${field}: ${value}`
          )
          const tooltipOrigin = this.options.sticky ? nearestDataPoint ?? touch : touch

          const [paddingTop, paddingRight, paddingBottom, paddingLeft] = this.options.containerStyle!.padding!

          const { width: estimatedContentWidth, height: estimatedContentHeight } = measureText(
            tooltipContent,
            this.options.textStyle
          )

          if (this.state === 'hide') {
            this.state = 'show'
            this.options.onShow?.({ origin: tooltipOrigin, data: activeDataPoints })
          } else {
            this.options.onChange?.({ origin: tooltipOrigin, data: activeDataPoints })
          }

          return [
            ...(this.options.label
              ? [
                  {
                    type: 'rect' as const,
                    origin: tooltipOrigin,
                    width: paddingLeft + estimatedContentWidth + paddingRight,
                    height: paddingTop + estimatedContentHeight + paddingBottom,
                    fill: this.options.containerStyle?.backgroundColor,
                  },
                  {
                    type: 'text' as const,
                    position: {
                      x: tooltipOrigin.x + paddingLeft,
                      y: tooltipOrigin.y + paddingTop,
                    },
                    text: tooltipContent,
                    ...this.options.textStyle,
                  },
                ]
              : []),
            //tooltip marker
            ...(this.options.tooltipMarker
              ? activeDataPoints.map(point => ({
                type: 'circle' as const,
                center: {
                  x: point.origin.x,
                  y: point.origin.y,
                },
                fill: point.fill,
                ...this.options.tooltipMarkerStyle,
              } as Circle))
              : []),
            // crosshair
            ...(this.options.crosshair
              ? [
                  // crosshair for x axis
                  {
                    type: 'line' as const,
                    from: { x: tooltipOrigin.x, y: graphicOptions.origin.y + graphicOptions.height },
                    to: { x: tooltipOrigin.x, y: graphicOptions.origin.y },
                    ...this.options.crosshairStyle,
                  },

                  // crosshair for y axis
                  {
                    type: 'line' as const,
                    from: { x: graphicOptions.origin.x, y: tooltipOrigin.y },
                    to: { x: graphicOptions.origin.x + graphicOptions.width, y: tooltipOrigin.y },
                    ...this.options.crosshairStyle,
                  },
                ].slice(
                  this.options.crosshairsType === 'y' ? 1 : 0,
                  this.options.crosshairsType === 'x' ? 1 : undefined
                )
              : []),
          ]
        },
      },
    ]
  }
}
