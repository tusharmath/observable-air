/**
 * Created by tushar.mathur on 16/10/16.
 */
import {Observable} from '../types/core/IObservable'
import {Observer} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {Subscription} from '../types/core/ISubscription'
import {SubscriberFunction} from '../types/core/ISubscriberFunction'
import {CreateSubscription} from '../lib/CreateSubscription'

export class CreateObservable<T> implements Observable<T> {
  constructor (private f: SubscriberFunction<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: IScheduler): Subscription {
    return CreateSubscription.from(this.f(observer, scheduler))
  }
}

export const create = <T> (f: SubscriberFunction<T>) => new CreateObservable(f)
