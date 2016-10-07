/**
 * Created by tushar.mathur on 06/10/16.
 */

import {IObservable} from '../types/core/IObservable';
import {IObserver} from '../types/core/IObserver';
import {IScheduler} from '../types/IScheduler';
import {ISubscription} from '../types/core/ISubscription';
import {ISubscriberFunction} from '../types/core/ISubscriberFunction';
import {Subscription} from '../Subscription';
import {SubscriptionObserver} from '../SubscriptionObserver';


export class TestObservable<T> implements IObservable<T> {
  constructor (private func: ISubscriberFunction<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return Subscription.from(this.func(new SubscriptionObserver(observer)))
  }
}
