/**
 * Created by tushar.mathur on 27/09/16.
 */

import {CompleteMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'

export type TSource<T> = IObservable<T>
export type TResult<R> = IObservable<R>

class CaptureObserver<T, R> extends CompleteMixin(Virgin)
  implements IObserver<T> {
  constructor(public sink: IObserver<Error>) {
    super()
  }

  next(val: T): void {}

  error(err: Error): void {
    this.sink.next(err)
  }
}

class CaptureObservable<T> implements TResult<Error> {
  constructor(private source: IObservable<T>) {}

  subscribe(observer: IObserver<Error>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new CaptureObserver(observer), scheduler)
  }
}

export const capture = curry(function<T>(source: TSource<T>) {
  return new CaptureObservable(source)
}) as {
  <T>(source: TSource<T>): TResult<T>
  <T>(): {(source: TSource<T>): TResult<T>}
}
