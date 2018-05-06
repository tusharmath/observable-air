/**
 * Created by tushar.mathur on 27/09/16.
 */

import {ErrorMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'

export type TReducer<T, R> = {(memory: R, current: T): R}
export type TSeed<R> = R
export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>

class ReduceObserver<T, R> extends ErrorMixin(Virgin) implements IObserver<T> {
  constructor(
    private reducer: TReducer<T, R>,
    private value: TSeed<R>,
    public sink: IObserver<R>
  ) {
    super()
  }

  next(val: T): void {
    this.value = this.reducer(this.value, val)
  }

  complete(): void {
    this.sink.next(this.value)
    this.sink.complete()
  }
}

class ReduceObservable<T, R> implements TResult<R> {
  constructor(
    private reducer: TReducer<T, R>,
    private seed: TSeed<R>,
    private source: TSource<T>
  ) {}

  subscribe(obr: IObserver<R>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(
      new ReduceObserver<T, R>(this.reducer, this.seed, obr),
      scheduler
    )
  }
}

export const reduce = curry(function<T, R>(
  t0: TReducer<T, R>,
  t1: R,
  t2: IObservable<T>
) {
  return new ReduceObservable(t0, t1, t2)
}) as {
  <T, R>(reducer: TReducer<T, R>, seed: TSeed<R>, source: TSource<T>): TResult<
    R
  >

  <T, R>(reducer: TReducer<T, R>): {
    (seed: TSeed<R>, source: TSource<T>): TResult<R>
  }

  <T, R>(reducer: TReducer<T, R>, seed: TSeed<R>): {
    (source: TSource<T>): TResult<R>
  }

  <T, R>(reducer: TReducer<T, R>): {
    (seed: TSeed<R>): {(source: TSource<T>): TResult<R>}
  }
}
