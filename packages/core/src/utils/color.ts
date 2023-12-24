import { createInterpolateColor, Linear } from '@antv/scale'

export const rgba2hex = (orig: string) => {
  const rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i) as any
  const hex = rgb
    ? '#' +
      ((rgb[1] > 255 ? 255 : rgb[1]) | (1 << 8)).toString(16).slice(1) +
      ((rgb[2] > 255 ? 255 : rgb[2]) | (1 << 8)).toString(16).slice(1) +
      ((rgb[3] > 255 ? 255 : rgb[3]) | (1 << 8)).toString(16).slice(1)
    : orig

  return hex
}

export const computeProportionalGradient = (linearGradient: string, curY: number, maxY: number, minY: number) => {
  // linear-gradient(90deg, #FFB802 0%, #FFFDF8 100%)
  const gradient = /\(([^)]+)\)/.exec(linearGradient)
  if (gradient) {
    const gradients = gradient[1].split(',')
    const stops = gradients[0].includes('deg') ? gradients.slice(1) : gradients
    const stopUnits = stops.map(unit => unit.trim().split(' '))
    const stopPercents = stopUnits.map(unit => +unit[1].replace('%', '') / 100)
    const yScale = new Linear({
      range: [minY, maxY],
      domain: [0, 1],
    })
    const colorScale = new Linear({
      interpolate: createInterpolateColor,
      range: [stopUnits[0][0], stopUnits[0][0], stopUnits[1][0], stopUnits[1][0]],
      domain: [0, ...stopPercents, 1],
    })

    const yPercent = yScale.invert(curY)
    const color = rgba2hex(colorScale.map(yPercent))

    // TODO: right now only handles (90deg, #000000 x%, #ffffff, 100%)
    stopUnits[0][0] = color
    stopUnits[0][1] = (Math.max(stopPercents[0] - yPercent, 0) / (1 - yPercent)) * 100 + '%'

    return `linear-gradient(${[
      gradients[0].includes('deg') ? gradients[0] : null,
      stopUnits.map(unit => unit.join(' ')),
    ]
      .filter(x => !!x)
      .join(', ')})`
  }
  return linearGradient
}
