/**
 * Created by tushar.mathur on 27/09/16.
 */

import {ISubscription} from './ISubscription'
import {IObserver} from './IObserver'
import {IScheduler} from '../IScheduler'

export interface IObservable<T> {
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription
}
