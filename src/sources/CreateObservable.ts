/**
 * Created by tushar.mathur on 16/10/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {SubscriberFunction} from '../types/core/SubscriberFunction'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {BaseSubscription} from '../lib/BaseSubscription'

export class CreateObservable<T> implements Observable<T> {
  constructor (private f: SubscriberFunction<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const cSub = new CompositeSubscription()
    cSub.add(scheduler.setTimeout(() => cSub.add(BaseSubscription.from(this.f(observer, scheduler))), 1))
    return cSub
  }
}

export const create = <T> (f: SubscriberFunction<T>) => new CreateObservable(f)
