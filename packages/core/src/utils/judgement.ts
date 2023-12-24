export const isNil = (value: unknown): value is null => value === null || value === undefined

export const isNotNil = (value: unknown): value is NonNullable<typeof value> => !isNil(value)

export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && Array.isArray(value) === false

export const isDateString = (value: string) => new Date(value).toString() !== 'Invalid Date'

export const isNumberArray = (range: any): range is [number, number] =>
  typeof range?.[0] === 'number' && typeof range?.[1] === 'number'
