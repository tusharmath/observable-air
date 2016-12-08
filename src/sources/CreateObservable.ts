/**
 * Created by tushar.mathur on 16/10/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {IScheduler} from '../types/IScheduler'
import {Subscription} from '../types/core/Subscription'
import {SubscriberFunction} from '../types/core/SubscriberFunction'
import {BaseSubscription} from '../lib/BaseSubscription'

export class CreateObservable<T> implements Observable<T> {
  constructor (private f: SubscriberFunction<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: IScheduler): Subscription {
    return BaseSubscription.from(this.f(observer, scheduler))
  }
}

export const create = <T> (f: SubscriberFunction<T>) => new CreateObservable(f)
