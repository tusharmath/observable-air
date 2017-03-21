/**
 * Created by tushar.mathur on 01/11/16.
 */
import {IObservable} from './Observable'
import {createScheduler} from './Scheduler'
import {ISubscription} from './Subscription'
import {curry} from './Utils'

export type TOnNext<T> = {(value: T): void}
export type TSource<T> = IObservable<T>
export type TResult = ISubscription

export const forEach = curry(function <T> (onNext: TOnNext<T>, observable: TSource<T>) {
  return observable.subscribe({
    next (value: T) {
      onNext(value)
    },
    complete() {
    },
    error (err: Error) {
      throw err
    }
  }, createScheduler())
}) as Function &
  {<T> (onNext: TOnNext<T>, source: TSource<T>): TResult} &
  {<T> (onNext: TOnNext<T>): {(source: TSource<T>): TResult}}

