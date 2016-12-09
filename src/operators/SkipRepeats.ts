/**
 * Created by niranjan on 12/10/16.
 */

import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../types/Scheduler'
import {Curry} from '../lib/Curry'

export type THasher<T, R> = (value: T) => R
export type TSource<T> = Observable<T>
export type TResult<T> = Observable<T>

class SkipRepeatsObserver <T, H> implements Observer<T> {
  private hash: H | void = undefined
  private init = true

  constructor (private hasher: {(a: T): H}, private sink: Observer<T>) {
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

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new SkipRepeatsObserver(this.hashFunction, observer), scheduler)
  }
}

export const skipRepeats = Curry(function (hashFunction: {(t: any): any}, source: Observable<any>) {
  return new SkipRepeatsObservable(hashFunction, source)
}) as Function &
  {<T, R> (mapper: THasher<T, R>, source: TSource<T>): TResult<T>} &
  {<T, R> (mapper: THasher<T, R>): {(source: TSource<T>): TResult<T>}}

