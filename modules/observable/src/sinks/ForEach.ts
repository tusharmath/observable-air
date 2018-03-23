/**
 * Created by tushar.mathur on 01/11/16.
 */
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {createScheduler, IScheduler} from '../schedulers/Scheduler'

export type TOnNext<T> = {(value: T): void} | IObserver<T>
export type TSource<T> = IObservable<T>
export type TResult = ISubscription

const noop = () => void 0

export type ForEachType = {
  <T>(onNext: TOnNext<T>, source: TSource<T>, scheduler?: IScheduler): TResult
  <T>(onNext: TOnNext<T>): {
    (source: TSource<T>, scheduler?: IScheduler): TResult
  }
}

export const forEach = curry(function<T>(
  next: TOnNext<T>,
  observable: TSource<T>,
  scheduler: IScheduler = createScheduler()
) {
  const observer: IObserver<T> =
    typeof next === 'function'
      ? {
          next,
          error: err => {
            iSubscription.unsubscribe()
            throw err
          },
          complete: noop
        }
      : next

  const iSubscription = observable.subscribe(observer, scheduler)
  return iSubscription
}) as ForEachType
