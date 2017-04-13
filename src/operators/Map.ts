/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'
import {IScheduler} from '../lib/Scheduler'


export type TMapper<T, R> = (value: T) => R
export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>


class MapObserver<T, R> implements IObserver<T> {
  constructor (private mapper: TMapper<T, R>, private sink: IObserver<R>) {

  }

  next (val: T): void {
    this.sink.next(this.mapper(val))
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}

class MapObservable <T, R> implements TResult<R> {
  constructor (private mapper: TMapper<T, R>, private source: TSource<T>) {
  }

  subscribe (observer: IObserver<R>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new MapObserver(this.mapper, observer), scheduler)
  }
}

export const map = curry(function <T, R> (mapFunction: (a: T) => R, source: IObservable<T>) {
  return new MapObservable(mapFunction, source)
}) as Function &
  {<T, R> (mapper: TMapper<T, R>, source: TSource<T>): TResult<R>} &
  {<T, R> (mapper: TMapper<T, R>): {(source: TSource<T>): TResult<R>}}
