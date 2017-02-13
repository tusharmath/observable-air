/**
 * Created by tushar.mathur on 16/10/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../lib/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {SubscriberFunction} from '../types/core/SubscriberFunction'
import {BaseSubscription} from '../lib/BaseSubscription'

class CreateObservable<T> implements Observable<T> {
  constructor (private f: SubscriberFunction<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return BaseSubscription.from(this.f(observer, scheduler))
  }
}

export const create = <T> (f: SubscriberFunction<T>): Observable<T> => new CreateObservable(f)
