/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/core/IObservable';
import {ISubscription} from './types/core/ISubscription';
import {ISubscriberFunction} from './types/core/ISubscriberFunction';
import {IObserver} from './types/core/IObserver';
import {IScheduler} from './types/IScheduler';
import {DefaultScheduler} from './schedulers/DefaultScheduler';
import {Subscription, CompositeSubscription} from './Subscription';
import {SubscriptionObserver} from './SubscriptionObserver';
import {SafeExecutor} from './lib/SafeExecutor';
import {Safety} from './types/ISafeValue';


export class Observable<T> implements IObservable<T> {
  constructor (private func: ISubscriberFunction<T>) {
  }

  static of<T> (...t: T[]): IObservable<T> {
    return new Observable(observer => {
      for (var i = 0; i < t.length; ++i) {
        observer.next(t[i])
      }
      observer.complete()
    })
  }

  safelyExecuteFunc (observer: IObserver<T>, subscription: CompositeSubscription) {
    const r = SafeExecutor(() => {
      subscription.add(Subscription.from(this.func(SubscriptionObserver.of(observer))))
    })
    if (r.type === Safety.error && observer.error) {
      observer.error(r.value as Error)
    }
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler = new DefaultScheduler()): ISubscription {

    const subscription: CompositeSubscription = Subscription.from([
      scheduler.scheduleASAP(() => this.safelyExecuteFunc(observer, subscription))
    ]) as CompositeSubscription

    if (observer.start) observer.start(subscription)

    return subscription
  }
}
