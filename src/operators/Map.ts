/**
 * Created by tushar.mathur on 27/09/16.
 */

import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Subscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'
import {Scheduler} from '../lib/Scheduler'


export type TMapper<T, R> = (value: T) => R
export type TSource<T> = Observable<T>
export type TResult<R> = Observable<R>


class MapObserver<T, R> implements Observer<T> {
  constructor (private mapper: TMapper<T, R>, private sink: Observer<R>) {

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

  subscribe (observer: Observer<R>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new MapObserver(this.mapper, observer), scheduler)
  }
}

export const map = curry(function <T, R> (mapFunction: (a: T) => R, source: Observable<T>) {
  return new MapObservable(mapFunction, source)
}) as Function &
  {<T, R> (mapper: TMapper<T, R>, source: TSource<T>): TResult<R>} &
  {<T, R> (mapper: TMapper<T, R>): {(source: TSource<T>): TResult<R>}}
