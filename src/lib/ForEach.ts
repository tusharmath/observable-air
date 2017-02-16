/**
 * Created by tushar.mathur on 01/11/16.
 */
import {Observable} from './Observable'
import {createScheduler} from './Scheduler'
import {Subscription} from './Subscription'
import {curry} from './Utils'
import {BaseObserver} from './BaseObserver'

export type TOnNext<T> = {(value: T): void}
export type TSource<T> = Observable<T>
export type TResult = Subscription

export const forEach = curry(function <T> (onNext: TOnNext<T>, observable: TSource<T>) {
  return observable.subscribe(BaseObserver.of(onNext), createScheduler())
}) as Function &
  {<T> (onNext: TOnNext<T>, source: TSource<T>): TResult} &
  {<T> (onNext: TOnNext<T>): {(source: TSource<T>): TResult}}

