/**
 * Created by tushar.mathur on 01/11/16.
 */
import {IObservable} from './Observable'
import {IObserver} from './Observer'
import {createScheduler} from './Scheduler'
import {ISubscription} from './Subscription'
import {curry} from './Utils'

export type TOnNext<T> = {(value: T): void} | IObserver<T>
export type TSource<T> = IObservable<T>
export type TResult = ISubscription

const error = (err: Error) => {
  throw err
}
const complete = () => void 0

export type ForEachType = {
  <T>(onNext: TOnNext<T>, source: TSource<T>): TResult
  <T>(onNext: TOnNext<T>): {(source: TSource<T>): TResult}
}

export const forEach = curry(function<T>(
  next: TOnNext<T>,
  observable: TSource<T>
) {
  const observer = typeof next === 'function'
    ? {
        next: next,
        complete: complete,
        error: error
      }
    : next
  return observable.subscribe(observer, createScheduler())
}) as ForEachType
