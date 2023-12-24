export const noop = () => undefined

export const toFractionDigits = (num: number, fractionDigits = 5) => {
  return Number(num.toFixed(fractionDigits))
}

export const isEqual = (a: number, b: number, fractionDigits = 5) => {
  return toFractionDigits(a, fractionDigits) === toFractionDigits(b, fractionDigits)
}

export const isLessThan = (a: number, b: number, fractionDigits = 5) => {
  return toFractionDigits(a, fractionDigits) <= toFractionDigits(b, fractionDigits)
}
