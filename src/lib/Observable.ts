/**
 * Created by tushar.mathur on 16/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {ISubscriberFunction} from '../types/core/ISubscriberFunction'
import {Subscription} from './Subscription'

export class Observable<T> implements IObservable<T> {
  constructor (private f: ISubscriberFunction<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return Subscription.from(this.f(observer, scheduler))
  }
}
