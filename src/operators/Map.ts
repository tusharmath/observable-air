/**
 * Created by tushar.mathur on 27/09/16.
 */

import {CompleteMixin, ErrorMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'

export type TMapper<T, R> = (value: T) => R
export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>

class MapObserver<T, R> extends ErrorMixin(CompleteMixin(Virgin))
  implements IObserver<T> {
  constructor(private mapper: TMapper<T, R>, public sink: IObserver<R>) {
    super()
  }

  next(val: T): void {
    this.sink.next(this.mapper(val))
  }
}

class MapObservable<T, R> implements TResult<R> {
  constructor(private mapper: TMapper<T, R>, private source: TSource<T>) {}

  subscribe(observer: IObserver<R>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(
      new MapObserver(this.mapper, observer),
      scheduler
    )
  }
}

export const map = curry(function<T, R>(
  mapFunction: (a: T) => R,
  source: IObservable<T>
) {
  return new MapObservable(mapFunction, source)
}) as {<T, R>(mapper: TMapper<T, R>, source: TSource<T>): TResult<R>} & {
  <T, R>(mapper: TMapper<T, R>): {(source: TSource<T>): TResult<R>}
}

export const tap = curry(function<T>(
  mapFunction: (a: T) => void,
  source: IObservable<T>
) {
  return new MapObservable((a: T) => {
    mapFunction(a)
    return a
  }, source)
}) as {<T>(mapper: TMapper<T, void>, source: TSource<T>): TResult<void>} & {
  <T>(mapper: TMapper<T, void>): {(source: TSource<T>): TResult<void>}
}

export const mapTo = curry(function<T extends Function>(
  mapFunction: T,
  source: IObservable<T>
) {
  return new MapObservable(() => mapFunction, source)
}) as {<T>(value: T, source: IObservable<any>): IObservable<T>} & {
  <T>(value: T): {(source: IObservable<any>): IObservable<T>}
}
