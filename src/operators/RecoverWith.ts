/**
 * Created by srijan02420 on 12/10/18.
 */

import {CompleteMixin, NextMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {flatMap, just} from '../main'
import {IScheduler} from '../schedulers/Scheduler'

export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>
export type TMapper<T> = (err: Error) => IObservable<T>

class RecoverWithObserver<T> extends NextMixin(CompleteMixin(Virgin))
  implements IObserver<T | Error> {
  constructor(public sink: IObserver<T | Error>) {
    super()
  }

  error(err: Error): void {
    this.sink.next(err)
  }
}

class RecoverWithObservable<T> implements TResult<T | Error> {
  constructor(private source: IObservable<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new RecoverWithObserver(observer), scheduler)
  }
}

export const recoverWith = curry(function<T>(
  mapFunction: TMapper<T>,
  source: TSource<T>
) {
  return flatMap(
    val => (val instanceof Error ? mapFunction(val) : just(val)),
    new RecoverWithObservable(source)
  )
}) as {
  <T>(mapper: TMapper<T>, source: TSource<T>): TResult<T>
  <T>(): {mapper: TMapper<T>; (source: TSource<T>): TResult<T>}
}
