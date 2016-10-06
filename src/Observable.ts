/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './core-types/IObservable';
import {ISubscription} from './core-types/ISubscription';
import {ISubscriberFunction} from './core-types/ISubscriberFunction';
import {IObserver} from './core-types/IObserver';
import {IScheduler} from './types/IScheduler';
import {DefaultScheduler} from './schedulers/DefaultScheduler';
import {ISubscriptionObserver} from './core-types/ISubscriptionObserver';


export class Observable<T> implements IObservable<T> {
  constructor (private func: ISubscriberFunction<T>) {
  }

  static of<U> (func: ISubscriberFunction<U>) {
    return new Observable(func)
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler = new DefaultScheduler()): ISubscription {
    return this.func(observer as ISubscriptionObserver<T>)
  }
}
