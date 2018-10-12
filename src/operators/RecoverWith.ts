/**
 * Created by srijan02420 on 12/10/18.
 */

import {CompleteMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'

export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>
export type TMapper<T> = (err: Error) => T

class RecoverWithObserver<T> extends CompleteMixin(Virgin)
  implements IObserver<T> {
  constructor(private mapper: TMapper<T>, public sink: IObserver<T>) {
    super()
  }

  next(val: T): void {
    this.sink.next(val)
  }

  error(err: Error): void {
    this.sink.next(this.mapper(err))
  }
}

class RecoverWithObservable<T> implements TResult<T> {
  constructor(private mapper: TMapper<T>, private source: IObservable<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new RecoverWithObserver(this.mapper, observer), scheduler)
  }
}

export const recoverWith = curry(function<T>(
  mapFunction: (a: Error) => T,
  source: TSource<T>
) {
  return new RecoverWithObservable(mapFunction, source)
}) as {
  <T>(mapper: TMapper<T>, source: TSource<T>): TResult<T>
  <T>(): {mapper: TMapper<T>, (source: TSource<T>): TResult<T>}
}
