/**
 * Created by tushar on 13/01/17.
 */
import {Filter} from '../operators/Filter'
import {forEach} from './ForEach'
import {Join} from '../operators/Join'
import {Mapper} from '../operators/Map'
import {Multicast} from '../operators/Multicast'
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {RafThrottle} from '../operators/RafThrottle'
import {Reducer} from '../operators/Reduce'
import {Sample} from '../operators/Sample'
import {Scanner} from '../operators/Scan'
import {Scheduler} from '../types/Scheduler'
import {SkipRepeats} from '../operators/SkipRepeats'
import {SliceObservable} from '../operators/Slice'
import {Subscription} from '../types/core/Subscription'
import {SwitchLatest} from '../operators/Switch'

export class ObservableAir<T> implements Observable<T> {
  constructor (private source: Observable<T>) {
  }

  static from <T> (s: Observable<T>) {
    return new ObservableAir(s)
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(observer, scheduler)
  }

  forEach (onNext: (t: T) => void) {
    return forEach(onNext, this)
  }

  multicast () {
    return ObservableAir.from(new Multicast(this))
  }

  join () {
    return ObservableAir.from(new Join(this as any))
  }

  map <R> (fn: (t: T) => R) {
    return ObservableAir.from(new Mapper(fn, this))
  }

  mapTo <R> (t: R) {
    return ObservableAir.from(new Mapper(() => t, this))
  }

  filter (fn: (t: T) => boolean) {
    return ObservableAir.from(new Filter(fn, this))
  }

  reduce <R> (fn: (m: R, v: T) => R, b: R) {
    return ObservableAir.from(new Reducer(fn, b, this))
  }

  sample (fn: {(...e: Array<any>): T}, ss: Observable<any>[]) {
    return ObservableAir.from(new Sample(fn, this, ss))
  }

  scan <R> (fn: (m: R, v: T) => R, b: R) {
    return ObservableAir.from(new Scanner(fn, b, this))
  }

  skipRepeats <R> (fn: (t: T) => R) {
    return ObservableAir.from(new SkipRepeats(fn, this))
  }

  slice (start: number, count: number) {
    return ObservableAir.from(new SliceObservable(start, count, this))
  }

  switchLatest () {
    return ObservableAir.from(new SwitchLatest(this as any))
  }

  tap (fn: (t: T) => void) {
    const tapper = (t: T) => {
      fn(t)
      return t
    }
    return ObservableAir.from(new Mapper((tapper), this))
  }

  rafThrottle () {
    return ObservableAir.from(new RafThrottle(this))
  }
}
