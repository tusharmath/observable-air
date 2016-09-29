/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/IObservable';
import {IObserver} from './types/IObserver';
import {ISubscription} from './types/ISubscription';

export interface ISubscriptionObserver<T> extends IObserver<T> {
  closed: Boolean
}

export interface ISubscriberFunction<T> {
  (observer: ISubscriptionObserver<T>): ISubscription
}


export class Observable<T> implements IObservable<T> {
  static of<U> (subscriberFunction: ISubscriberFunction<U>) {
    return new Observable(subscriberFunction)
  }

  constructor (private subscriberFunction: ISubscriberFunction<T>) {
  }

  subscribe (observer: ISubscriptionObserver<T>): ISubscription {
    return this.subscriberFunction(observer)
  }
}
