/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Curry} from '../lib/Curry'


export type TReducer<T, R> = {(previousValue: R, currentValue: T): R}
export type TSeed<R> = R
export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>

class ReduceObserver<T, R> implements IObserver<T> {
  constructor (private reducer: TReducer<T, R>,
               private value: TSeed<R>,
               private sink: IObserver<R>) {
  }

  next (val: T): void {
    this.value = this.reducer(this.value, val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.next(this.value)
    this.sink.complete()
  }
}

export class ReduceObservable <T, R> implements TResult<R> {
  constructor (private reducer: TReducer<T, R>,
               private seed: TSeed<R>,
               private source: TSource<T>) {
  }

  subscribe (obr: IObserver<R>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ReduceObserver<T, R>(this.reducer, this.seed, obr), scheduler)
  }
}

export const reduce = Curry(function <T, R> (t0: TReducer<T, R>, t1: R, t2: IObservable<T>) {
  return new ReduceObservable(t0, t1, t2)
}) as Function &
  {<T, R>(reducer: TReducer<T, R>, seed: TSeed<R>, source: TSource<T>): TResult<R>} &
  {<T, R>(reducer: TReducer<T, R>): {(seed: TSeed<R>, source: TSource<T>): TResult<R>}} &
  {<T, R>(reducer: TReducer<T, R>, seed: TSeed<R>): {(source: TSource<T>): TResult<R>}} &
  {<T, R>(reducer: TReducer<T, R>): { (seed: TSeed<R>): { (source: TSource<T>): TResult<R> } } }
