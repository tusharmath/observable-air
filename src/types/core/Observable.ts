/**
 * Created by tushar.mathur on 27/09/16.
 */

import {Subscription} from './Subscription'
import {Observer} from './Observer'
import {IScheduler} from '../IScheduler'

export interface Observable<T> {
  subscribe(observer: Observer<T>, scheduler: IScheduler): Subscription
}
