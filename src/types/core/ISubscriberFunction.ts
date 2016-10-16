/**
 * Created by tushar.mathur on 05/10/16.
 */

import {ISubscription} from './ISubscription'
import {IObserver} from './IObserver'
import {IScheduler} from '../IScheduler'

export interface ISubscriberFunction<T> {
  (observer: IObserver<T>, scheduler: IScheduler): ISubscription | void | (() => void)
}
