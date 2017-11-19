/**
 * Created by tushar.mathur on 01/11/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {createScheduler, IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'

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