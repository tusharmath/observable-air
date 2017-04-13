/**
 * Created by tushar.mathur on 05/10/16.
 */

import {ISubscription} from './Subscription'
import {IObserver} from './Observer'
import {IScheduler} from './Scheduler'

export interface ISubscriberFunction<T> {
  (observer: IObserver<T>, scheduler: IScheduler): ISubscription | void | (() => void)
}
