/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Curry} from '../lib/Curry'


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

export class MapObservable <T, R> implements TResult<R> {
  constructor (private mapper: TMapper<T, R>, private source: TSource<T>) {
  }

  subscribe (observer: IObserver<R>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new MapObserver(this.mapper, observer), scheduler)
  }
}

export const map = Curry(function <T, R> (mapFunction: (a: T) => R, source: IObservable<T>) {
  return new MapObservable(mapFunction, source)
}) as Function &
  {<T, R> (mapper: TMapper<T, R>, source: TSource<T>): TResult<R>} &
  {<T, R> (mapper: TMapper<T, R>): {(source: TSource<T>): TResult<R>}}
