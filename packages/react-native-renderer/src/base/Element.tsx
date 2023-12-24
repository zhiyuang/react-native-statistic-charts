import React from 'react'
import { Animated } from 'react-native'
import {
  G,
  Rect,
  Line,
  Circle,
  Polygon,
  Text,
  TSpan,
  TextAnchor,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
} from 'react-native-svg'
import { Element, uniqueFilter, toSVG, Path as PathType } from 'react-native-statistic-charts-core'
import { isGradientColor, color } from '../utils/color'
import { useInteractionState } from '../hook/useInteraction'

const APath = Animated.createAnimatedComponent(Path)

export const ElementRenderer: React.FC<{ element: Element }> = React.memo(({ element }) => {
  const state = useInteractionState(element.eid)

  const shapes = state === 'default' ? element.shapes : element.state?.[state] ?? element.shapes

  const gradient = element.shapes
    .map<Array<string | undefined>>(shape => [shape.strokeColor, shape.fill])
    .reduce((res, val) => res.concat(val), []) // flatten
    .filter((color): color is NonNullable<typeof color> => !!color && isGradientColor(color))
    .filter(uniqueFilter)

  return (
    <G>
      <Defs>
        {gradient.map(value => {
          const type = value.includes('linear-gradient') ? 'linear' : 'radial'
          const stops = value.match(/\((.+)\)/)?.[1]?.split(/,\s?/) ?? []

          const rotate =
            type === 'linear' && stops[0].includes('deg') ? stops.shift()?.replace(/\D/g, '') ?? 0 : undefined

          return type === 'linear' ? (
            <LinearGradient
              key={value}
              id={value}
              x2={rotate ? Math.cos((+rotate / 180) * Math.PI) : 1}
              y2={rotate ? Math.sin((+rotate / 180) * Math.PI) : 0}
            >
              {stops.map((stop, index) => {
                const [color, length] = stop.split(' ')
                return <Stop key={index} offset={length} stopColor={color} />
              })}
            </LinearGradient>
          ) : (
            <RadialGradient key={value} id={value}>
              {stops.map((stop, index) => {
                const [color, position] = stop.split(' ')
                return <Stop key={index} offset={position} stopColor={color} />
              })}
            </RadialGradient>
          )
        })}
      </Defs>
      {shapes.map((shape, shapeIdx) => {
        switch (shape.type) {
          case 'rect':
            return (
              <Rect
                key={shapeIdx}
                x={shape.origin.x}
                y={shape.origin.y}
                width={shape.width}
                height={shape.height}
                fill={shape.fill}
                stroke={shape.strokeColor}
                strokeWidth={shape.strokeWidth}
                strokeDasharray={shape.strokeStyle === 'dashed' ? shape.dashedStyle ?? [4] : undefined}
                transform={shape.transform && toSVG(shape.transform)}
                rx={shape.radius}
                ry={shape.radius}
              />
            )
          case 'line':
            return (
              <Line
                key={shapeIdx}
                x1={shape.from.x}
                y1={shape.from.y}
                x2={shape.to.x}
                y2={shape.to.y}
                stroke={shape.strokeColor}
                strokeWidth={shape.strokeWidth}
                strokeDasharray={shape.strokeStyle === 'dashed' ? shape.dashedStyle ?? [4] : undefined}
                transform={shape.transform && toSVG(shape.transform)}
              />
            )
          case 'path': {
            if (element.animating && element.prevShapes) {
              element.animating = false
              const prevShape = element.prevShapes[shapeIdx] as PathType
              const anim = new Animated.Value(0)
              const d = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [prevShape.d, shape.d],
              })

              Animated.timing(anim, {
                toValue: 1,
                useNativeDriver: true,
                ...element.animateOptions,
              }).start()
              return (
                <APath
                  key={shapeIdx}
                  d={d}
                  stroke={shape.strokeColor}
                  strokeWidth={shape.strokeWidth}
                  strokeDasharray={shape.strokeStyle === 'dashed' ? shape.dashedStyle ?? [4] : undefined}
                  transform={shape.transform && toSVG(shape.transform)}
                  fill={color(shape.fill)}
                  fillOpacity={shape.fillOpacity}
                />
              )
            }
            return (
              <Path
                key={shapeIdx}
                d={shape.d}
                stroke={shape.strokeColor}
                strokeWidth={shape.strokeWidth}
                strokeDasharray={shape.strokeStyle === 'dashed' ? shape.dashedStyle ?? [4] : undefined}
                fill={color(shape.fill)}
                fillOpacity={shape.fillOpacity}
                transform={shape.transform && toSVG(shape.transform)}
              />
            )
          }
          case 'circle':
            return (
              <Circle
                key={shapeIdx}
                cx={shape.center.x}
                cy={shape.center.y}
                r={shape.radius}
                stroke={shape.strokeColor}
                strokeWidth={shape.strokeWidth}
                strokeDasharray={shape.strokeStyle === 'dashed' ? shape.dashedStyle ?? [4] : undefined}
                fill={shape.fill}
                transform={shape.transform && toSVG(shape.transform)}
              />
            )
          case 'polygon':
            return (
              <Polygon
                key={shapeIdx}
                points={shape.points.map(point => `${point.x},${point.y}`).join(' ')}
                stroke={shape.strokeColor}
                strokeWidth={shape.strokeWidth}
                strokeDasharray={shape.strokeStyle === 'dashed' ? shape.dashedStyle ?? [4] : undefined}
                fill={color(shape.fill)}
                fillOpacity={shape.fillOpacity}
              />
            )
          case 'text':
            return (
              <Text
                key={shapeIdx}
                x={shape.position.x}
                y={shape.position.y}
                stroke={shape.strokeColor}
                strokeWidth={shape.strokeWidth}
                strokeDasharray={shape.strokeStyle === 'dashed' ? shape.dashedStyle ?? [4] : undefined}
                fill={shape.color}
                fontSize={shape.fontSize}
                fontWeight={shape.fontWeight}
                textAnchor={{ left: 'start', center: 'middle', right: 'end' }[shape.align ?? 'left'] as TextAnchor}
                alignmentBaseline={shape.verticalAlign ?? 'top'}
                transform={shape.transform && toSVG(shape.transform)}
              >
                {shape.text.map((text, index) => (
                  <TSpan
                    x={shape.position.x}
                    dy={(shape.fontSize ?? 12) * (shape.lineHeight ?? 1.2) * (index === 0 ? 0 : 1)}
                    // dy={(shape.fontSize ?? 12) * (shape.lineHeight ?? 1.2) * index}
                    key={index}
                  >
                    {text}
                  </TSpan>
                ))}
              </Text>
            )
        }
      })}
    </G>
  )
})
