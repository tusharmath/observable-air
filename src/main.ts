/**
 * Created by tushar on 17/02/17.
 */
import {create} from './sources/Create'
import {debounce} from './operators/Debounce'
import {delay} from './operators/Delay'
import {filter} from './operators/Filter'
import {forEach} from './lib/ForEach'
import {frames} from './sources/Frames'
import {fromDOM} from './sources/FromDOM'
import {fromPromise} from './sources/FromPromise'
import {interval} from './sources/Interval'
import {join, flatMap} from './operators/Join'
import {map} from './operators/Map'
import {merge} from './operators/Merge'
import {multicast} from './operators/Multicast'
import {Observable} from './lib/Observable'
import {Observer} from './lib/Observer'
import {of} from './sources/FromArray'
import {reduce} from './operators/Reduce'
import {sample} from './operators/Sample'
import {scan} from './operators/Scan'
import {Scheduler, createScheduler} from './lib/Scheduler'
import {skipRepeats} from './operators/SkipRepeats'
import {slice} from './operators/Slice'
import {SubscriberFunction} from './lib/SubscriberFunction'
import {Subscription} from './lib/Subscription'
import {switchLatest, switchMap} from './operators/Switch'


const air = <T> (o: Observable<T>) => new Air(o)

/**
 * Base class for fluidic API
 * @implements Observable
 * @class
 */
export default class Air<T> implements Observable<T> {
  constructor (private src: Observable<T>) {}

  subscribe (observer: Observer<T>, scheduler: Scheduler = createScheduler()): Subscription {
    return this.src.subscribe(observer, scheduler)
  }

  static create <T> (f: SubscriberFunction<T>) {
    return air(create(f))
  }

  debounce (time: number) {
    return air(debounce(time, this.src))
  }

  delay (time: number) {
    return air(delay(time, this.src))
  }

  filter (p: (t: T) => boolean) {
    return air(filter(p, this.src))
  }

  forEach (next: (t: T) => void) {
    return forEach(next, this.src)
  }

  static frames () {
    return air(frames())
  }

  static fromDOM (el: HTMLElement, ev: string) {
    return air(fromDOM(el, ev))
  }

  static fromPromise <T> (f: () => Promise<T>) {
    return air(fromPromise(f))
  }

  static interval (time: number) {
    return air(interval(time))
  }

  join () {
    return air(join(this.src  as any))
  }

  flatMap <K> (fn: (t: T) => Observable<K>) {
    return air(flatMap(fn, this.src))
  }

  map <K> (fn: (t: T) => K) {
    return air(map(fn, this.src))
  }

  static merge <T> (...t: Array<Observable<any>>) {
    return air(merge<T>(...t))
  }

  multicast () {
    return air(multicast(this.src))
  }

  static of <T> (...l: Array<T>) {
    return air(of(...l))
  }

  reduce <R> (fn: (memory: R, current: T) => R, memory: R) {
    return air(reduce(fn, memory, this.src))
  }

  sample (fn: (...t: any[]) => T, ob: Array<Observable<any>>) {
    return air(sample(fn, this.src, ob))
  }

  scan <R> (fn: (memory: R, current: T) => R, memory: R) {
    return air(scan(fn, memory, this.src))
  }

  skipRepeats (cmp: (a: T, b: T) => boolean) {
    return air(skipRepeats(cmp, this.src))
  }

  slice (start: number, count: number) {
    return air(slice(start, count, this.src))
  }

  switchLatest () {
    return air(switchLatest(this.src as any))
  }

  switchMap <K> (fn: (t: T) => Observable<K>) {
    return air(switchMap(fn, this.src))
  }
}