/**
 * Created by tushar.mathur on 09/10/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'

export type TReducer <T, R> = (memory: R, current: T) => R
export type TSeed <R> = R
export type TSource <T> = Observable<T>
export type TResult <R> = Observable<R>

export class ScanObserver<T, V> implements Observer<T> {

  constructor (private reducer: TReducer<T, V>,
               private value: V,
               private sink: Observer<V>) {
  }

  next (val: T): void {
    this.value = this.reducer(this.value, val)
    this.sink.next(this.value)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }

}

export class Scanner<T, R> implements TResult<R> {
  constructor (private reducer: TReducer<T, R>, private seed: TSeed<R>, private source: TSource<T>) {

  }

  subscribe (observer: Observer<R>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new ScanObserver<T, R>(this.reducer, this.seed, observer), scheduler)
  }
}
