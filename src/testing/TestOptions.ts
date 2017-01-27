/**
 * Created by tushar on 27/01/17.
 */

export type OptionType = {
  start: number
  stop: number
  size: number
}
const DEFAULT_OPTIONS = {
  start: 200,
  stop: 2000,
  size: 10
}

export const resolveOptions = (opt: {start?: number, stop?: number, size?: number} = {}): OptionType => {
  return {...opt, ...DEFAULT_OPTIONS}
}
