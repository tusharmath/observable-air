/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Subscription} from './Subscription'
import {Observer} from './Observer'
import {Scheduler} from '../../lib/Scheduler'

export interface Observable<T> {
  subscribe(observer: Observer<T>, scheduler: Scheduler): Subscription
}
