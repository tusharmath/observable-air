/**
 * Created by tushar.mathur on 15/10/16.
 */


import {ICurryFunction} from '../types/ICurryFunction'

export function Curry<T, R> (f: ICurryFunction<T>): ICurryFunction<T> {
  if (f.length <= 1) return f
  return function curried (...t: any[]): T | ICurryFunction<T> {
    if (t.length === 0) return curried
    if (t.length >= f.length) return f(...t)
    return curried.bind(this, ...t)
  }
}
