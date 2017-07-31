/**
 * Created by tushar.mathur on 27/09/16.
 */
import {IObservable} from './Observable'
import {IObserver} from './Observer'
import {IScheduler} from './Scheduler'
import {ISubscription} from './Subscription'

export interface IObservable<T> {
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription
}
