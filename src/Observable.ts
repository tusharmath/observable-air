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

  static of<T> (...t: T[]): IObservable<T> {
    return new Observable(observer => {
      for (var i = 0; i < t.length; ++i) {
        observer.next(t[i])
      }
      observer.complete()
    })
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
