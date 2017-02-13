/**
 * Created by tushar.mathur on 05/10/16.
 */

import {Subscription} from './Subscription'
import {Observer} from './Observer'
import {Scheduler} from './Scheduler'

export interface SubscriberFunction<T> {
  (observer: Observer<T>, scheduler: Scheduler): Subscription | void | (() => void)
}
