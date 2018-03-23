/**
 * Created by tushar.mathur on 09/10/16.
 */
import {CompleteMixin, ErrorMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'

export type TReducer<T, R> = (memory: R, current: T) => R
export type TSeed<R> = R
export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>

class ScanObserver<T, V> extends ErrorMixin(CompleteMixin(Virgin))
  implements IObserver<T> {
  constructor(
    private reducer: TReducer<T, V>,
    private value: V,
    public sink: IObserver<V>
  ) {
    super()
  }

  next(val: T): void {
    this.value = this.reducer(this.value, val)
    this.sink.next(this.value)
  }
}

class ScanObservable<T, R> implements TResult<R> {
  constructor(
    private reducer: TReducer<T, R>,
    private seed: TSeed<R>,
    private source: TSource<T>
  ) {}

  subscribe(observer: IObserver<R>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(
      new ScanObserver<T, R>(this.reducer, this.seed, observer),
      scheduler
    )
  }
}

export const scan = curry(function<T, V>(
  reducer: TReducer<T, V>,
  value: V,
  source: IObservable<T>
) {
  return new ScanObservable(reducer, value, source)
}) as {
  <T, R>(reducer: TReducer<T, R>, seed: TSeed<R>, source: TSource<T>): TResult<
    R
  >
} & {
  <T, R>(reducer: TReducer<T, R>): {
    (seed: TSeed<R>, source: TSource<T>): TResult<R>
  }
} & {
  <T, R>(reducer: TReducer<T, R>, seed: TSeed<R>): {
    (source: TSource<T>): TResult<R>
  }
} & {
  <T, R>(reducer: TReducer<T, R>): {
    (seed: TSeed<R>): {(source: TSource<T>): TResult<R>}
  }
}
