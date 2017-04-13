/**
 * Created by niranjan on 12/10/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'

export type TComparator<T> = (a: T, b: T) => boolean
export type TSource<T> = IObservable<T>
export type TResult<T> = IObservable<T>

class SkipRepeatsObserver <T> implements IObserver<T> {
  private previous: T | void = undefined
  private init = true

  constructor (private cmp: {(a: T, b: T): boolean}, private sink: IObserver<T>) {
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

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new SkipRepeatsObserver(this.cmp, observer), scheduler)
  }
}

export const skipRepeats = curry(function (hashFunction: {(t: any): any}, source: IObservable<any>) {
  return new SkipRepeatsObservable(hashFunction, source)
}) as Function &
  {<T> (cmp: TComparator<T>, source: TSource<T>): TResult<T>} &
  {<T> (cmp: TComparator<T>): {(source: TSource<T>): TResult<T>}}

