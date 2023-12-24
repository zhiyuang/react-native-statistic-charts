import isEqual from 'lodash-es/isEqual'
import { ChartOptions } from '@/types/chart'
import { AxisOptions, GuideLineOptions, GuidePointOptions, GuideLabelOptions } from '@/types/guide'
import { TooltipOptions } from '@/types/tooltip'
import { Element, LineOptions, AreaOptions, PointOptions, IntervalOptions } from '@/types/geometry'
import { Tooltip } from '@/tooltip'
import { Axis } from '@/guide/axis'
import { GuideLine } from '@/guide/line'
import { GuidePoint } from '@/guide/point'
import { Line as GeometryLine } from '@/geometry/line'
import { Area as GeometryArea } from '@/geometry/area'
import { Point as GeometryPoint } from '@/geometry/point'
import { Interval as GeometryInterval } from '@/geometry/interval'

import { Coordinate, CartesianCoord, PolarCoord } from '../coord'
import { DataSource } from './data'
import { LayoutManager } from './layout'
import { InteractionManager } from './interaction'
import { ChartComponent, ComponentType } from './component'
import { AnimationManager } from './animation'
import { CoordinateOptions } from '@/types/coord'
import { GuideLabel } from '../guide/label'

export class Chart {
  private options!: ChartOptions
  coord!: Coordinate
  dataSource!: DataSource
  components: ChartComponent[] = []
  elements: Element[] = []

  layoutManager = new LayoutManager()
  interactionManager = new InteractionManager()
  animationManager = new AnimationManager(this)

  constructor(options: ChartOptions) {
    this.update(options)
  }

  update(options: ChartOptions) {
    if (!this.coord || !isEqual(this.options?.coord, options.coord)) {
      const coordOptions: CoordinateOptions = {
        ...(options.coord ?? {}),
        height: options.style.height,
        width: options.style.width,
        origin: { x: 0, y: 0 },
      }
      this.coord = options.coord?.type === 'polar' ? new PolarCoord(coordOptions) : new CartesianCoord(coordOptions)
    }

    if (!isEqual(this.options?.style, options.style)) {
      this.layoutManager.update({
        layoutWidth: options.style.width,
        layoutHeight: options.style.height,
        padding: options.style.padding,
      })
    }

    if (!isEqual(this.options?.data, options.data) || !isEqual(this.options?.scale, options.scale)) {
      this.dataSource = new DataSource(options.data, options.scale)
    }

    if (!isEqual(this.options?.animation, options.animation)) {
      this.animationManager.update(options.animation)
    }

    this.options = options
  }

  layout() {
    this.layoutManager.layout(this)
  }

  graphic(cid?: string, layout = true) {
    let newElements: Element[] = []
    if (layout) {
      this.layout()
    }

    if (cid) {
      // prevElements = this.elements.filter
      newElements = this.elements.filter(element => element.cid !== cid)
    }

    this.components
      .filter(component => (cid ? component.id === cid : true))
      .forEach(component => {
        const graphicOptions = this.layoutManager.get(component.id)
        let elements = component.graphic(this, graphicOptions)
        //animation
        if (!this.coord.isPolar && component.animatable && this.options.animation) {
          const prevElements = this.elements.filter(element => element.cid === component.id)
          elements = this.animationManager.composeAnimation(elements, prevElements)
        }
        newElements.push(...elements)
      })

    this.elements = newElements

    this.interactionManager.update({
      interactiveElements: this.elements.filter(element => element.interaction),
    })

    return this.elements
  }

  getOptions() {
    return this.options
  }

  getComponentsByType<T extends ChartComponent>(type: ComponentType): T[] {
    return this.components.filter((component): component is T => component.id.startsWith(String(type)))
  }

  getComponentById(id: string) {
    return this.components.find(component => component.id === id)
  }

  remove(id: string) {
    this.components = this.components.filter(component => component.id !== id)
    this.elements = this.elements.filter(element => element.cid !== id)
  }

  axis(options: AxisOptions): Axis {
    const axis = new Axis(this, options)
    this.components.push(axis)
    return axis
  }

  tooltip(options: TooltipOptions): Tooltip {
    const tooltip = new Tooltip(this, options)
    this.components.push(tooltip)
    return tooltip
  }

  guideLine(options: GuideLineOptions): GuideLine {
    const guideLine = new GuideLine(this, options)
    this.components.push(guideLine)
    return guideLine
  }

  guidePoint(options: GuidePointOptions): GuidePoint {
    const guidePoint = new GuidePoint(this, options)
    this.components.push(guidePoint)
    return guidePoint
  }

  guideLabel(options: GuideLabelOptions): GuideLabel {
    const guideLabel = new GuideLabel(this, options)
    this.components.push(guideLabel)
    return guideLabel
  }

  point(options: PointOptions) {
    const point = new GeometryPoint(this, options)
    this.components.push(point)
    return point
  }

  line(options: LineOptions) {
    const line = new GeometryLine(this, options)
    this.components.push(line)
    return line
  }

  area(options: AreaOptions) {
    const area = new GeometryArea(this, options)
    this.components.push(area)
    return area
  }

  interval(options: IntervalOptions) {
    const interval = new GeometryInterval(this, options)
    this.components.push(interval)
    return interval
  }
}
