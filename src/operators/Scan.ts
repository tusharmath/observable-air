/**
 * Created by tushar.mathur on 09/10/16.
 */


import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {Curry} from '../lib/Curry'

export type TReducer <T, R> = (current: T, memory: R) => R
export type TSeed <R> = R
export type TSource <T> = Observable<T>
export type TResult <R> = Observable<R>

export class ScanObserver<T, V> implements Observer<T> {

  constructor (private reducer: TReducer<T, V>,
               private value: V,
               private sink: Observer<V>) {
  }

  next (val: T): void {
    this.value = this.reducer(val, this.value)
    this.sink.next(this.value)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }

}

export class ScanObservable<T, R> implements TResult<R> {
  constructor (private reducer: TReducer<T, R>, private seed: TSeed<R>, private source: TSource<T>) {

  }

  subscribe (observer: Observer<R>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new ScanObserver<T, R>(this.reducer, this.seed, observer), scheduler)
  }
}

export const scan = Curry(function <T, V> (reducer: TReducer<T, V>, value: V, source: Observable<T>) {
  return new ScanObservable(reducer, value, source)
}) as Function &
  {<T, R>(reducer: TReducer<T, R>, seed: TSeed<R>, source: TSource<T>): TResult<R>} &
  {<T, R>(reducer: TReducer<T, R>): {(seed: TSeed<R>, source: TSource<T>): TResult<R>}} &
  {<T, R>(reducer: TReducer<T, R>, seed: TSeed<R>): {(source: TSource<T>): TResult<R>}} &
  {<T, R>(reducer: TReducer<T, R>): { (seed: TSeed<R>): { (source: TSource<T>): TResult<R> } } }
