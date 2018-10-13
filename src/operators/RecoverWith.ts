/**
 * Created by srijan02420 on 12/10/18.
 */

import {CompleteMixin, NextMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'

export type TSource<T> = IObservable<T>
export type TMapper<R> = (err: Error) => R
export type TResult<S> = IObservable<S>

class RecoverWithObserver<T, R> extends NextMixin(CompleteMixin(Virgin))
  implements IObserver<T | R> {
  constructor(private mapper: TMapper<R>, public sink: IObserver<T | R>) {
    super()
  }

  error(err: Error): void {
    this.sink.next(this.mapper(err))
  }
}

class RecoverWithObservable<T, R> implements TResult<T | R> {
  constructor(private mapper: TMapper<R>, private source: IObservable<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(
      new RecoverWithObserver(this.mapper, observer),
      scheduler
    )
  }
}

export const recoverWith = curry(function<T, R>(
  mapFunction: (a: Error) => R,
  source: TSource<T>
) {
  return new RecoverWithObservable(mapFunction, source)
}) as {
  <T, R>(mapper: TMapper<R>, source: TSource<T>): TResult<T | R>
  <T, R>(): {mapper: TMapper<R>; (source: TSource<T>): TResult<T | R>}
}
