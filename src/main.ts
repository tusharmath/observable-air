/**
 * Created by tushar.mathur on 11/10/16.
 */
import {Observable} from './types/core/Observable'
import {SubscriberFunction} from './types/core/SubscriberFunction'
import {CreateObservable} from './sources/CreateObservable'
import {FromDOM} from './sources/FromDOM'
import {Interval} from './sources/Interval'
import {Merge} from './operators/Merge'
import {FromObservable} from './sources/FromArray'
import {Combine} from './operators/Combine'
import {Air} from './lib/ObservableAir'


export {forEach} from './lib/ForEach'
export {fromPromise} from './sources/FromPromise'
export {Air} from './lib/ObservableAir'
export {Observable} from './types/core/Observable'
export {Observer} from './types/core/Observer'
export {SubscriberFunction} from './types/core/SubscriberFunction'
export {Subscription} from './types/core/Subscription'

export const air = Air.from

export const create = <T> (f: SubscriberFunction<T>) => {
  return air(new CreateObservable(f))
}
export const fromDOM = (el: HTMLElement, name: string) => {
  return air(new FromDOM(name, el))
}
export const interval = (n: number) => {
  return air(new Interval(n))
}
export const merge = (...sources: Observable<any>[]) => {
  return air(new Merge(sources))
}
export const of = <T> (...t: T[]) => {
  return air(new FromObservable(t))
}
export const fromArray = <T> (t: T[]) => {
  return air(new FromObservable(t))
}
const defaultCombinator = (...t: any[]) => t
export const combine = (source: Observable<any>[], fn: <R> (...t: any[]) => R = defaultCombinator) => {
  return air(new Combine(fn, source))
}
