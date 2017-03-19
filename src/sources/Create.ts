/**
 * Created by tushar.mathur on 16/10/16.
 */
import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Scheduler} from '../lib/Scheduler'
import {Subscription, BaseSubscription} from '../lib/Subscription'
import {SubscriberFunction} from '../lib/SubscriberFunction'


class CreateObservable<T> implements Observable<T> {
  constructor (private f: SubscriberFunction<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return BaseSubscription.from(this.f(observer, scheduler))
  }
}

export const create = <T> (f: SubscriberFunction<T>): Observable<T> => new CreateObservable(f)
