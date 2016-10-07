/**
 * Created by tushar.mathur on 07/10/16.
 */

import {ISubscriptionObserver} from './types/ISubscriptionObserver';
import {IObserver} from './types/IObserver';

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
  }

  static of<T> (observer: IObserver<T>) {
    return new SubscriptionObserver(observer)
  }
}
