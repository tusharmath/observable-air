/**
 * Created by tushar on 10/12/16.
 */

import {IObservable} from './src/lib/Observable'
import {IObserver} from './src/lib/Observer'
import {IScheduler} from './src/lib/Scheduler'
import {ISubscription} from './src/lib/Subscription'
import * as O from './src/main'
import {combine} from './src/operators/Combine'
import {debounce} from './src/operators/Debounce'
import {toNodeStream} from './src/sinks/ToNodeStream'
import {fromNodeStream} from './src/sources/FromNodeStream'
import { Readable } from './src/lib/Readable';
export {Observable} from './src/lib/Observable'

export class Air<T> implements IObservable<T> {
  constructor(private src: IObservable<T>) {}
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.src.subscribe(observer, scheduler)
  }
  concatMap<S>(fn: (t: T) => IObservable<S>) {
    return new Air(O.concatMap(fn, this))
  }
  concat(src: IObservable<T>) {
    return new Air(O.concat(this, src))
  }
  delay(t: number) {
    return new Air(O.delay(t, this))
  }
  filter(fn: (t: T) => boolean) {
    return new Air(O.filter(fn, this))
  }
  flatMap<S>(fn: (t: T) => IObservable<S>) {
    return new Air(O.flatMap(fn, this))
  }
  forEach(fn: (t: T) => void) {
    return O.forEach(fn, this)
  }
  join() {
    return new Air(O.join(this as any))
  }
  mapTo<S>(t: S) {
    return new Air(O.mapTo(t, this))
  }
  map<S>(fn: (t: T) => S) {
    return new Air(O.map(fn, this))
  }
  mergeMap<S>(n: number, project: (t: T) => IObservable<S>) {
    return new Air(O.mergeMap(n, project, this))
  }
  multicast() {
    return new Air(O.multicast(this))
  }
  reduce<R>(fn: (memory: R, current: T) => R, seed: R) {
    return new Air(O.reduce(fn, seed, this))
  }
  sample(fn: (...e: Array<any>) => T, sources: Array<IObservable<any>>) {
    return new Air(O.sample(fn, this, sources))
  }
  skipRepeats(fn: (a: T, b: T) => boolean) {
    return new Air(O.skipRepeats(fn, this))
  }
  slice(start: number, count: number) {
    return new Air(O.slice(start, count, this))
  }
  switchLatest() {
    return new Air(O.switchLatest(this as any))
  }
  switchMap<S>(fn: (t: T) => IObservable<S>) {
    return new Air(O.switchMap(fn, this))
  }
  tap(fn: (t: T) => void) {
    return new Air(O.tap(fn, this))
  }
  uniqueWith(set: Set<any>) {
    return new Air(O.uniqueWith(set, this))
  }
  unique() {
    return new Air(O.unique(this))
  }
  debounce(t: number) {
    return new Air(debounce(t, this))
  }
  toNodeStream() {
    return toNodeStream(this)
  }
  toPromise() {
    return O.toPromise(this)
  }
  static combine<T>(selector: (...t: any[]) => T, sources: IObservable<any>[]) {
    return new Air(combine(selector, sources))
  }
  static fromNodeStream(node: Readable) {
    return new Air(fromNodeStream(node))
  }
  static empty() {
    return new Air(O.empty())
  }
  static frames() {
    return new Air(O.frames())
  }
  static fromArray<T>(arr: Array<T>) {
    return new Air(O.fromArray(arr))
  }
  static fromDOM(el: HTMLElement, event: string) {
    return new Air(O.fromDOM(el, event))
  }
  static fromPromise<T>(fn: () => Promise<T>) {
    return new Air(O.fromPromise(fn))
  }
  static interval(t: number) {
    return new Air(O.interval(t))
  }
  static just<T>(t: T) {
    return new Air(O.just(t))
  }
  static never() {
    return new Air(O.never())
  }
  static of<T>(...t: T[]) {
    return new Air(O.of(...t))
  }
}
