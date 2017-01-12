/**
 * Created by tushar on 11/01/17.
 */
import {create} from '../sources/CreateObservable'
import {filter} from '../operators/Filter'
import {forEach} from './ForEach'
import {fromDOM} from '../sources/FromDOM'
import {fromPromise} from '../sources/FromPromise'
import {interval} from '../sources/Interval'
import {join} from '../operators/Join'
import {map} from '../operators/Map'
import {merge} from '../operators/Merge'
import {multicast} from '../operators/Multicast'
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {of} from '../sources/FromArray'
import {reduce} from '../operators/Reduce'
import {sample} from '../operators/Sample'
import {scan} from '../operators/Scan'
import {skipRepeats} from '../operators/SkipRepeats'
import {slice} from '../operators/Slice'
import {SubscriberFunction} from '../types/core/SubscriberFunction'
import {Subscription} from '../types/core/Subscription'
import {switchLatest} from '../operators/Switch'
import {Scheduler} from '../types/Scheduler'

export const fluid = <T> (s: Observable<T>) => new FluidObservable(s)

export class FluidObservable<T> implements Observable<T> {
  constructor (private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(observer, scheduler)
  }

  static create <T> (f: SubscriberFunction<T>) {
    return fluid(create(f))
  }

  static fromDOM (el: HTMLElement, name: string) {
    return fluid(fromDOM(el, name))
  }

  static fromPromise <T> (f: () => Promise<T>) {
    return fluid(fromPromise(f))
  }

  static interval (n: number) {
    return fluid(interval(n))
  }

  static merge (...sources: Observable<any>[]) {
    return fluid(merge(...sources))
  }

  static of <T> (...t: T[]) {
    return fluid(of(...t))
  }

  forEach (onNext: (t: T) => void) {
    return forEach(onNext, this)
  }

  multicast () {
    return fluid(multicast(this))
  }

  join () {
    return fluid(join(this as any))
  }

  map <R> (fn: (t: T) => R) {
    return fluid(map(fn, this))
  }

  filter (fn: (t: T) => boolean) {
    return fluid(filter(fn, this))
  }

  reduce <R> (fn: (m: R, v: T) => R, b: R) {
    return fluid(reduce(fn, b, this))
  }

  sample <S> (fn: {(...e: Array<any>): T}, s: Observable<S>, ss: Observable<any>[]) {
    return fluid(sample(fn, s, ss))
  }

  scan <R> (fn: (v: T, m: R) => R, b: R) {
    return fluid(scan(fn, b, this))
  }

  skipRepeats <R> (fn: (t: T) => R) {
    return fluid(skipRepeats(fn, this))
  }

  slice (start: number, count: number) {
    return fluid(slice(start, count, this))
  }

  switchLatest () {
    return fluid(switchLatest(this as any))
  }
}
