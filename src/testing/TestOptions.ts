/**
 * Created by tushar on 27/01/17.
 */

export type OptionType = {
  start: number
  stop: number
  size: number
  rafTimeout: number
}
const DEFAULT_OPTIONS = {
  start: 200,
  stop: 2000,
  size: 10,
  rafTimeout: 16
}

export const resolveOptions = <T> (opt: T): OptionType & T => {
  return Object.assign({}, DEFAULT_OPTIONS, opt)
}
