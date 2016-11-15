/**
 * Created by tushar.mathur on 09/10/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {Curry} from '../lib/Curry'

export type TReducer <T, R> = (current: T, memory: R) => R
export type TSeed <R> = R
export type TSource <T> = IObservable<T>
export type TResult <R> = IObservable<R>

export class ScanObserver<T, V> implements IObserver<T> {

  constructor (private reducer: TReducer<T, V>,
               private value: V,
               private sink: IObserver<V>) {
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

  subscribe (observer: IObserver<R>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ScanObserver<T, R>(this.reducer, this.seed, observer), scheduler)
  }
}

export const scan = Curry(function <T, V> (reducer: TReducer<T, V>, value: V, source: IObservable<T>) {
  return new ScanObservable(reducer, value, source)
}) as Function &
  {<T, R>(reducer: TReducer<T, R>, seed: TSeed<R>, source: TSource<T>): TResult<R>} &
  {<T, R>(reducer: TReducer<T, R>): {(seed: TSeed<R>, source: TSource<T>): TResult<R>}} &
  {<T, R>(reducer: TReducer<T, R>, seed: TSeed<R>): {(source: TSource<T>): TResult<R>}} &
  {<T, R>(reducer: TReducer<T, R>): { (seed: TSeed<R>): { (source: TSource<T>): TResult<R> } } }
