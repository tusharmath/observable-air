/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './core-types/IObservable';
import {ISubscription} from './core-types/ISubscription';
import {ISubscriberFunction} from './core-types/ISubscriberFunction';
import {IObserver} from './core-types/IObserver';
import {Observer} from './Observer';


class SubscriptionWrapper<T> implements ISubscription {
  private __closed: boolean

  constructor (private func: () => void) {
    this.__closed = false
  }

  unsubscribe (): void {
    this.func()
    this.__closed = true
  }

  get closed () {
    return this.__closed
  }
}


export class Observable<T> implements IObservable<T> {
  static of<U> (subscriberFunction: ISubscriberFunction<U>) {
    return new Observable(subscriberFunction)
  }

  constructor (private func: ISubscriberFunction<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    const subscription = this.func(new Observer(observer))
    if (typeof subscription === 'function') {
      return new SubscriptionWrapper(subscription as (() => void))
    }
    return subscription as ISubscription
  }
}
