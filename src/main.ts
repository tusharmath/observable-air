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
import {ObservableAir} from './lib/ObservableAir'


export {forEach} from './lib/ForEach'
export {fromPromise} from './sources/FromPromise'
export {ObservableAir} from './lib/ObservableAir'
export {Observable} from './types/core/Observable'
export {Observer} from './types/core/Observer'
export {SubscriberFunction} from './types/core/SubscriberFunction'
export {Subscription} from './types/core/Subscription'

export const from = ObservableAir.from

export const create = <T> (f: SubscriberFunction<T>) => {
  return from(new CreateObservable(f))
}
export const fromDOM = (el: HTMLElement, name: string) => {
  return from(new FromDOM(name, el))
}
export const interval = (n: number) => {
  return from(new Interval(n))
}
export const merge = (...sources: Observable<any>[]) => {
  return from(new Merge(sources))
}
export const of = <T> (...t: T[]) => {
  return from(new FromObservable(t))
}
export const fromArray = <T> (t: T[]) => {
  return from(new FromObservable(t))
}
export const combine = <R> (fn: (...t: any[]) => R, source: Observable<any>[]) => {
  return from(new Combine(fn, source))
}
