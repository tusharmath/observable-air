/**
 * Created by tushar.mathur on 06/10/16.
 */

import {IObservable} from '../core-types/IObservable';
import {IObserver} from '../core-types/IObserver';
import {IScheduler} from '../types/IScheduler';
import {ISubscription} from '../core-types/ISubscription';
import {ISubscriberFunction} from '../core-types/ISubscriberFunction';
import {ISubscriptionObserver} from '../core-types/ISubscriptionObserver';


export class TestObservable<T> implements IObservable<T> {
  constructor (private func: ISubscriberFunction<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.func(observer as ISubscriptionObserver<T>)
  }
}
