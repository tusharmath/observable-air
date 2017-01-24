/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../types/Scheduler'


export type TReducer<T, R> = {(previousValue: R, currentValue: T): R}
export type TSeed<R> = R
export type TSource<T> = Observable<T>
export type TResult<R> = Observable<R>

class ReduceObserver<T, R> implements Observer<T> {
  constructor (private reducer: TReducer<T, R>,
               private value: TSeed<R>,
               private sink: Observer<R>) {
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

export class Reducer <T, R> implements TResult<R> {
  constructor (private reducer: TReducer<T, R>,
               private seed: TSeed<R>,
               private source: TSource<T>) {
  }

  subscribe (obr: Observer<R>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new ReduceObserver<T, R>(this.reducer, this.seed, obr), scheduler)
  }
}
