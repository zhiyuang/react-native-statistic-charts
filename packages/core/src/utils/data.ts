import { ChartData, Point } from '@/types'

export const uniqueFilter = (value: any, index: number, self: any[]) => self.indexOf(value) === index

export const getValuesOfField = (data: ChartData, field: string) =>
  data.filter(record => Object.prototype.hasOwnProperty.call(record, field)).map(record => record[field])

export const getSampleValueOfField = (data: ChartData, field: string) =>
  data.find(record => Object.prototype.hasOwnProperty.call(record, field))?.[field]

export const unifyArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value])

export const mapObject = <T extends Record<string, unknown>, V>(
  obj: T,
  mapFn: (value: unknown) => V
): Record<string, V> =>
  Object.entries(obj)
    .map<[string, V]>(([key, value]) => [key, mapFn(value)])
    .reduce((res, [key, value]) => ({ ...res, [key]: value }), {})

export const nearest = (source: Point, targets: Point[]): Point | null => {
  if (targets.length === 0) return null
  if (targets.length === 1) return targets[0]

  return targets
    .map<[Point, number]>(point => [point, Math.pow(point.y - source.y, 2) + Math.pow(point.x - source.x, 2)])
    .sort(([, d1], [, d2]) => d1 - d2)[0][0]
}
