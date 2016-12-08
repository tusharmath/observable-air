/**
 * Created by tushar.mathur on 05/10/16.
 */

import {Subscription} from './ISubscription'
import {Observer} from './IObserver'
import {IScheduler} from '../IScheduler'

export interface SubscriberFunction<T> {
  (observer: Observer<T>, scheduler: IScheduler): Subscription | void | (() => void)
}
