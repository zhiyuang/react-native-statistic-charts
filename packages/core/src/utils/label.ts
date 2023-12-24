import { Point } from '@/types/geometry'
import { PlacementPosition } from '@/types/guide'

export const getRectPoints = (box: { origin: Point; width: number; height: number }) => {
  return [
    box.origin,
    { x: box.origin.x + box.width, y: box.origin.y },
    { x: box.origin.x + box.width, y: box.origin.y + box.height },
    { x: box.origin.x, y: box.origin.y + box.height },
  ]
}

export const getLabelRectBBox = (
  placement: PlacementPosition,
  origin: Point,
  offset: number,
  width: number,
  height: number,
  radius: number,
  arrow: { base: number; height: number } = { base: 0, height: 0 }
) => {
  let rectOrigin = { ...origin }
  const offsetY = offset + arrow.height
  const offsetX = radius + arrow.base / 2

  switch (placement) {
    case PlacementPosition.Top:
      rectOrigin = { x: origin.x - width / 2, y: origin.y - height - offsetY }
      break
    case PlacementPosition.Left:
      rectOrigin = { x: origin.x - width - offsetY, y: origin.y - height / 2 }
      break
    case PlacementPosition.Right:
      rectOrigin = { x: origin.x + offsetY, y: origin.y - height / 2 }
      break
    case PlacementPosition.Bottom:
      rectOrigin = { x: origin.x - width / 2, y: origin.y + offsetY }
      break
    case PlacementPosition.TopLeft:
      rectOrigin = { x: origin.x - width + offsetX, y: origin.y - height - offsetY }
      break
    case PlacementPosition.LeftTop:
      rectOrigin = { x: origin.x - width - offsetY, y: origin.y - height + offsetX }
      break
    case PlacementPosition.TopRight:
      rectOrigin = { x: origin.x - offsetX, y: origin.y - height - offsetY }
      break
    case PlacementPosition.RightTop:
      rectOrigin = { x: origin.x + offsetY, y: origin.y - height + offsetX }
      break
    case PlacementPosition.BottomLeft:
      rectOrigin = { x: origin.x - width + offsetX, y: origin.y + offsetY }
      break
    case PlacementPosition.LeftBottom:
      rectOrigin = { x: origin.x - width - offsetY, y: origin.y - offsetX }
      break
    case PlacementPosition.RightBottom:
      rectOrigin = { x: origin.x + offsetY, y: origin.y - offsetX }
      break
    case PlacementPosition.BottomRight:
      rectOrigin = { x: origin.x - offsetX, y: origin.y + offsetY }
      break
  }
  return { origin: rectOrigin, width, height }
}

export const getLabelArrowPoints = (
  placement: PlacementPosition,
  origin: Point,
  offset: number,
  base: number,
  height: number
) => {
  let p1, p2, o
  switch (placement) {
    case PlacementPosition.Top:
    case PlacementPosition.TopLeft:
    case PlacementPosition.TopRight:
      o = { x: origin.x, y: origin.y - offset }
      p1 = { x: origin.x - base / 2, y: origin.y - height - offset }
      p2 = { x: origin.x + base / 2, y: origin.y - height - offset }
      break
    case PlacementPosition.Right:
    case PlacementPosition.RightTop:
    case PlacementPosition.RightBottom:
      o = { x: origin.x + offset, y: origin.y }
      p1 = { x: origin.x + height + offset, y: origin.y - base / 2 }
      p2 = { x: origin.x + height + offset, y: origin.y + base / 2 }
      break
    case PlacementPosition.Bottom:
    case PlacementPosition.BottomLeft:
    case PlacementPosition.BottomRight:
      o = { x: origin.x, y: origin.y + offset }
      p1 = { x: origin.x - base / 2, y: origin.y + height + offset }
      p2 = { x: origin.x + base / 2, y: origin.y + height + offset }
      break
    case PlacementPosition.Left:
    case PlacementPosition.LeftTop:
    case PlacementPosition.LeftBottom:
      o = { x: origin.x - offset, y: origin.y }
      p1 = { x: origin.x - height - offset, y: origin.y - base / 2 }
      p2 = { x: origin.x - height - offset, y: origin.y + base / 2 }
      break
  }
  return [o, p1, p2]
}
