/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/core/IObservable';
import {ISubscription} from './types/core/ISubscription';
import {ISubscriberFunction} from './types/core/ISubscriberFunction';
import {IObserver} from './types/core/IObserver';
import {IScheduler} from './types/IScheduler';
import {DefaultScheduler} from './scheduling/DefaultScheduler';
import {Subscription, CompositeSubscription} from './Subscription';
import {SubscriptionObserver} from './SubscriptionObserver';
import {SafeExecutor} from './lib/SafeExecutor';
import {Safety} from './types/ISafeValue';
import {ISubscriptionObserver} from './types/core/ISubscriptionObserver';


function startObserver <T> (observer: IObserver<T>,
                            subscription: CompositeSubscription) {
  if (observer.start)
    observer.start(subscription)
}

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

  private safelyExecuteFunc (observer: ISubscriptionObserver<T>, cSub: CompositeSubscription) {
    const r = SafeExecutor(() => cSub.add(Subscription.from(this.func(observer))))
    if (r.type === Safety.error) observer.error(r.value as Error)
  }

  subscribe (observer: IObserver<T> | ((t: T) => void), scheduler: IScheduler = new DefaultScheduler()): ISubscription {
    const subObserver = SubscriptionObserver.from(observer)
    const subscription = new CompositeSubscription()
    const task = () => this.safelyExecuteFunc(subObserver, subscription);
    subscription.add(scheduler.scheduleNow(task))
    startObserver(observer as IObserver<T>, subscription);
    return subscription
  }

}
