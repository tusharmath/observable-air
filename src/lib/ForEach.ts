/**
 * Created by tushar.mathur on 01/11/16.
 */
import {Observable} from '../types/core/Observable'
import {DefaultScheduler} from '../scheduling/DefaultScheduler'
import {Subscription} from '../types/core/Subscription'
import {BaseObserver} from './BaseObserver'

export type TOnNext<T> = {(value: T): void}
export type TSource<T> = Observable<T>
export type TResult = Subscription

export const forEach = function <T> (onNext: TOnNext<T>, observable: TSource<T>) {
  return observable.subscribe(BaseObserver.of(onNext), DefaultScheduler.of())
}
