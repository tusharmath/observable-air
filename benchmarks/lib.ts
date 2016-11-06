/**
 * Created by tushar.mathur on 05/11/16.
 */


import {IObservable} from '../src/types/core/IObservable'
import {Observer} from '../src/lib/Observer'
import {DefaultScheduler} from '../src/scheduling/DefaultScheduler'

export interface IDeferred {
  resolve (): void
}
export function add1 (x: number) {
  return x + 1
}
export function even (e: number) {
  return e % 2 === 0
}
export function sum (a: number, b: number) {
  return a + b
}

export function passthrough (z: any, x: any) {
  return x
}

export const scheduler = new DefaultScheduler()

export function run (observable: IObservable<any>, d: IDeferred) {
  observable.subscribe(Observer.of(undefined, undefined, () => d.resolve()), scheduler)
}

export function array (n: number) {
  const a = new Array(n)
  for (var i = 0; i < a.length; ++i) {
    a[i] = i
  }
  return a
}

export const onCycle = (event: any) => console.log(String(event.target))
