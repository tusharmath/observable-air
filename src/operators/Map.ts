/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'

export type TMapper<T, R> = (value: T) => R
export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>

class MapObserver<T, R> implements IObserver<T> {
  constructor(private mapper: TMapper<T, R>, private sink: IObserver<R>) {}

  next(val: T): void {
    this.sink.next(this.mapper(val))
  }

  error(err: Error): void {
    this.sink.error(err)
  }

  complete(): void {
    this.sink.complete()
  }
}

class MapObservable<T, R> implements TResult<R> {
  constructor(private mapper: TMapper<T, R>, private source: TSource<T>) {}

  subscribe(observer: IObserver<R>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new MapObserver(this.mapper, observer), scheduler)
  }
}

export const map = curry(function<T, R>(mapFunction: (a: T) => R, source: IObservable<T>) {
  return new MapObservable(mapFunction, source)
}) as {<T, R>(mapper: TMapper<T, R>, source: TSource<T>): TResult<R>} & {
  <T, R>(mapper: TMapper<T, R>): {(source: TSource<T>): TResult<R>}
}

export const tap = curry(function<T>(mapFunction: (a: T) => void, source: IObservable<T>) {
  return new MapObservable((a: T) => {
    mapFunction(a)
    return a
  }, source)
}) as {<T>(mapper: TMapper<T, void>, source: TSource<T>): TResult<void>} & {
  <T>(mapper: TMapper<T, void>): {(source: TSource<T>): TResult<void>}
}

export const mapTo = curry(function<T extends Function>(mapFunction: T, source: IObservable<T>) {
  return new MapObservable(() => mapFunction, source)
}) as {<T>(value: T, source: IObservable<any>): IObservable<T>} & {
  <T>(value: T): {(source: IObservable<any>): IObservable<T>}
}
