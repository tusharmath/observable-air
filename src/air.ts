/**
 * Created by tushar on 17/02/17.
 */
import {Observable} from './lib/Observable'
import {Observer} from './lib/Observer'
import {Scheduler, createScheduler} from './lib/Scheduler'
import {Subscription} from './lib/Subscription'
import * as O from './main'
import {SubscriberFunction} from './lib/SubscriberFunction'

const air = <T> (o: Observable<T>) => new Air(o)

export class Air<T> implements Observable<T> {
  constructor (private src: Observable<T>) {}

  subscribe (observer: Observer<T>, scheduler: Scheduler = createScheduler()): Subscription {
    return this.src.subscribe(observer, scheduler)
  }

  static create <T> (f: SubscriberFunction<T>) {
    return air(O.create(f))
  }

  debounce (time: number) {
    return air(O.debounce(time, this.src))
  }

  delay (time: number) {
    return air(O.delay(time, this.src))
  }

  filter (p: (t: T) => boolean) {
    return air(O.filter(p, this.src))
  }

  forEach (next: (t: T) => void) {
    return O.forEach(next, this.src)
  }

  static frames () {
    return air(O.frames())
  }

  static fromDOM (el: HTMLElement, ev: string) {
    return air(O.fromDOM(el, ev))
  }

  static fromPromise <T> (f: () => Promise<T>) {
    return air(O.fromPromise(f))
  }

  static interval (time: number) {
    return air(O.interval(time))
  }

  join () {
    return air(O.join(this.src  as any))
  }

  flatMap <K> (fn: (t: T) => Observable<K>) {
    return air(O.flatMap(fn, this.src))
  }

  map <K> (fn: (t: T) => K) {
    return air(O.map(fn, this.src))
  }

  static merge <T> (...t: Array<Observable<any>>) {
    return air(O.merge<T>(...t))
  }

  multicast () {
    return air(O.multicast(this.src))
  }

  static of <T> (...l: Array<T>) {
    return air(O.of(...l))
  }

  reduce <R> (fn: (memory: R, current: T) => R, memory: R) {
    return air(O.reduce(fn, memory, this.src))
  }

  sample (fn: (...t: any[]) => T, ob: Array<Observable<any>>) {
    return air(O.sample(fn, this.src, ob))
  }

  scan <R> (fn: (memory: R, current: T) => R, memory: R) {
    return air(O.scan(fn, memory, this.src))
  }

  skipRepeats (cmp: (a: T, b: T) => boolean) {
    return air(O.skipRepeats(cmp, this.src))
  }

  slice (start: number, count: number) {
    return air(O.slice(start, count, this.src))
  }

  switchLatest () {
    return air(O.switchLatest(this.src as any))
  }

  switchMap <K> (fn: (t: T) => Observable<K>) {
    return air(O.switchMap(fn, this.src))
  }
}