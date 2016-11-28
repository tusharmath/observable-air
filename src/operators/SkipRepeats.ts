/**
 * Created by niranjan on 12/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Curry} from '../lib/Curry'

export type THasher<T, R> = (value: T) => R
export type TSource<T> = IObservable<T>
export type TResult<T> = IObservable<T>

class SkipRepeatsObserver <T, H> implements IObserver<T> {
  private hash: H | void = undefined
  private init = true

  constructor (private hasher: {(a: T): H}, private sink: IObserver<T>) {
  }

  next (val: T) {
    const hash = this.hasher(val)
    if (this.init) {
      this.init = false
      this.sink.next(val)
      this.hash = hash
    }
    else if (this.hash !== hash) {
      this.sink.next(val)
      this.hash = hash
    }
  }

  error (err: Error) {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

export class SkipRepeatsObservable <T, H> implements TResult <T> {
  constructor (private hashFunction: THasher<T, H>, private source: TSource<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new SkipRepeatsObserver(this.hashFunction, observer), scheduler)
  }
}

export const skipRepeats = Curry(function (hashFunction: {(t: any): any}, source: IObservable<any>) {
  return new SkipRepeatsObservable(hashFunction, source)
}) as Function &
  {<T, R> (mapper: THasher<T, R>, source: TSource<T>): TResult<T>} &
  {<T, R> (mapper: THasher<T, R>): {(source: TSource<T>): TResult<T>}}

