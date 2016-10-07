/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/IObservable';
import {ISubscription} from './types/ISubscription';
import {ISubscriberFunction} from './types/ISubscriberFunction';
import {IObserver} from './types/IObserver';
import {IScheduler} from './types/IScheduler';
import {DefaultScheduler} from './schedulers/DefaultScheduler';
import {Subscription, CompositeSubscription} from './Subscription';

export class Observable<T> implements IObservable<T> {
  constructor (private func: ISubscriberFunction<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler = new DefaultScheduler()): ISubscription {
    const subscription: CompositeSubscription = Subscription.from([
      scheduler.scheduleASAP(() => subscription.add(
        Subscription.from(this.func(observer))
      ))
    ]) as CompositeSubscription

    return subscription
  }
}
