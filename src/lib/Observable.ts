/**
 * Created by tushar.mathur on 27/09/16.
 */
import {ISubscription} from './Subscription'
import {IObserver} from './Observer'
import {IScheduler} from './Scheduler'
import {IObservable} from './Observable'

export interface IObservable<T> {
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription
}

