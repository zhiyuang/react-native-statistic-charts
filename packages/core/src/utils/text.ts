import merge from 'lodash-es/merge'
import { unifyArray } from './data'

/**
 * estimate text width and height by text content
 *
 * @param {(string | string[])} text
 * @param {Partial<{ fontSize: number; lineHeight: number }>} [styleOptions]
 * @returns
 */
export const measureText = (
  text: string | string[],
  styleOptions?: Partial<{ fontSize: number; lineHeight: number }>
) => {
  const style = merge({ fontSize: 12, lineHeight: 1.2 }, styleOptions)

  return unifyArray(text).length
    ? {
        width: Math.max(
          ...unifyArray(text).map(text => {
            const specialChars = text.split('').filter(c => [',', '.', ' ', ';'].includes(c))
            const specialNums = text.split('').filter(c => ['1'].includes(c))
            return (
              text.length * style.fontSize * 0.55 -
              specialChars.length * style.fontSize * 0.25 -
              specialNums.length * style.fontSize * 0.2
            ) // 0.2, 0.3 is an experimental value
          })
        ),
        height: Math.ceil(style.fontSize * style.lineHeight * unifyArray(text).length),
      }
    : { width: 0, height: 0 }
}
