/**
 * Created by tushar.mathur on 07/10/16.
 */

import {ISubscriptionObserver} from './types/core/ISubscriptionObserver';
import {IObserver} from './types/core/IObserver';

export class SubscriptionObserverStub <T> implements ISubscriptionObserver<T> {
  closed: boolean;

  next (val: T): void {
  }

  error (err: Error): void {
  }

  complete (): void {
  }
}

export class SubscriptionObserver<T> implements ISubscriptionObserver<T> {
  closed: boolean;

  constructor (private sink: IObserver<T>) {
    this.closed = false
  }

  next (val: T): void {
    this.sink.next(val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
    this.closed = true
  }

  static from<T> (observer: IObserver<T>) {
    if (!observer.next || !observer.complete || !observer.error)
      return new SubscriptionObserverStub()
    return new SubscriptionObserver(observer)
  }
}
