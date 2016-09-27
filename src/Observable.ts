/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/IObservable';
import {IObserver} from './types/IObserver';
import {ISubscription} from './types/ISubscription';
import {Subscription} from './Subscription';

export interface ISubscriberFunction {
  (observer: IObserver): ISubscription | (() => void)
}


export class Observable implements IObservable {
  static of (subscriberFunction: ISubscriberFunction) {
    return new Observable(subscriberFunction)
  }

  private __subscriberFunction: ISubscriberFunction

  constructor (subscriberFunction: ISubscriberFunction) {
    this.__subscriberFunction = subscriberFunction
  }

  subscribe (observer: IObserver): ISubscription {
    const subscription = new Subscription()
    this.__subscriberFunction(observer)
    return subscription
  }
}
