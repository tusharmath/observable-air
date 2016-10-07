/**
 * Created by tushar.mathur on 07/10/16.
 */

import {ISubscriptionObserver} from './types/core/ISubscriptionObserver';
import {IObserver} from './types/core/IObserver';

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
    if (this.sink.complete) this.sink.complete()
    this.closed = true
  }

  static of<T> (observer: IObserver<T>) {
    return new SubscriptionObserver(observer)
  }
}
