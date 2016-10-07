/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './core-types/IObservable';
import {ISubscription} from './core-types/ISubscription';
import {ISubscriberFunction} from './core-types/ISubscriberFunction';
import {IObserver} from './core-types/IObserver';
import {IScheduler} from './types/IScheduler';
import {DefaultScheduler} from './schedulers/DefaultScheduler';
import {Subscription} from './Subscription';

export class Observable<T> implements IObservable<T> {
  constructor (private func: ISubscriberFunction<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler = new DefaultScheduler()): ISubscription {
    return new Subscription(this.func, observer, scheduler).run()
  }
}
