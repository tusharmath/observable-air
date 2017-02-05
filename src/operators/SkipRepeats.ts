/**
 * Created by niranjan on 12/10/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../types/Scheduler'
import {Curry} from '../lib/Curry'

export type TComparator<T> = (a: T, b: T) => boolean
export type TSource<T> = Observable<T>
export type TResult<T> = Observable<T>

class SkipRepeatsObserver <T> implements Observer<T> {
  private previous: T | void = undefined
  private init = true

  constructor (private cmp: {(a: T, b: T): boolean}, private sink: Observer<T>) {
  }

  next (val: T) {
    if (this.init) {
      this.init = false
      this.sink.next(val)
      this.previous = val
    }
    else if (this.cmp(this.previous as T, val) === false) {
      this.sink.next(val)
      this.previous = val
    }
  }

  error (err: Error) {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

class SkipRepeatsObservable <T> implements TResult <T> {
  constructor (private cmp: TComparator<T>, private source: TSource<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new SkipRepeatsObserver(this.cmp, observer), scheduler)
  }
}

export const skipRepeats = Curry(function (hashFunction: {(t: any): any}, source: Observable<any>) {
  return new SkipRepeatsObservable(hashFunction, source)
}) as Function &
  {<T> (cmp: TComparator<T>, source: TSource<T>): TResult<T>} &
  {<T> (cmp: TComparator<T>): {(source: TSource<T>): TResult<T>}}

