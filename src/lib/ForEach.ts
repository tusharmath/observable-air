/**
 * Created by tushar.mathur on 01/11/16.
 */

import {Observable} from '../types/core/IObservable'
import {DefaultScheduler} from '../scheduling/DefaultScheduler'
import {Subscription} from '../types/core/ISubscription'
import {Curry} from './Curry'
import {BaseObserver} from './BaseObserver'

export type TOnNext<T> = {(value: T): void}
export type TSource<T> = Observable<T>
export type TResult = Subscription

export const forEach = Curry(function <T> (onNext: TOnNext<T>, observable: TSource<T>) {
  return observable.subscribe(BaseObserver.of(onNext), DefaultScheduler.of())
}) as Function &
  {<T, R> (onNext: TOnNext<T>, source: TSource<T>): TResult} &
  {<T, R> (onNext: TOnNext<T>): {(source: TSource<T>): TResult}}

