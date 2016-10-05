/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './core-types/IObservable';
import {ISubscription} from './core-types/ISubscription';
import {ISubscriberFunction} from './core-types/ISubscriberFunction';
import {
  IObserver,
  INextFunction,
  IErrorFunction,
  ICompleteFunction
} from './core-types/IObserver';
import {SubscriptionObserver} from './SubscriptionObserver';
import {Subscription} from './Subscription';


export class Observable<T> implements IObservable<T> {
  constructor (private func: ISubscriberFunction<T>) {
  }

  static of<U> (subscriberFunction: ISubscriberFunction<U>) {
    return new Observable(subscriberFunction)
  }

  subscribe (onNext: IObserver<T> | INextFunction<T>,
             onError?: IErrorFunction,
             onComplete?: ICompleteFunction): ISubscription {

    return Subscription.from(this.func(
      SubscriptionObserver.from(onNext, onError, onComplete)
    ))
  }
}
