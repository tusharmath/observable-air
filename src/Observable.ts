/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/IObservable';
import {IObserver} from './types/IObserver';
import {ISubscription} from './types/ISubscription';

export interface ISubscriptionObserver extends IObserver {
  closed: Boolean
}

export interface ISubscriberFunction {
  (observer: ISubscriptionObserver): ISubscription
}


export class Observable implements IObservable {
  static of (subscriberFunction: ISubscriberFunction) {
    return new Observable(subscriberFunction)
  }

  constructor (private subscriberFunction: ISubscriberFunction) {
  }

  subscribe (observer: ISubscriptionObserver): ISubscription {
    return this.subscriberFunction(observer)
  }
}
