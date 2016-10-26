/**
 * Created by tushar.mathur on 15/10/16.
 */


import {
  ICurriedFunction,
  ICurriedFunction2,
  ICurriedFunction3
} from '../types/ICurriedFunction'

export function Curry (f: ICurriedFunction): ICurriedFunction {
  if (f.length <= 1) return f
  return function curried (...t: any[]) {
    if (t.length === 0) return curried
    if (t.length >= f.length) return f(...t)
    return curried.bind(this, ...t)
  }
}

export function Curry2<T1, T2, R> (f: {(t1: T1, t2: T2): R}) {
  return Curry(f) as ICurriedFunction2<T1, T2, R>
}

export function Curry3<T1, T2, T3, R> (f: {(t1: T1, t2: T2, t3: T3): R}) {
  return Curry(f) as ICurriedFunction3<T1, T2, T3, R>
}
