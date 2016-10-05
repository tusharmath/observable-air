/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ISubscriptionObserver} from './core-types/ISubscriptionObserver';
import {IObserver} from './core-types/IObserver';

export class Observer<T> implements ISubscriptionObserver<T> {
  closed: boolean;

  constructor (private sink: IObserver<T>) {
    this.closed = false
  }

  next (val: T): void {
    if (this.closed) return
    this.sink.next(val)
  }

  error (err: Error): void {
    if (this.closed) return
    this.sink.error(err)
  }

  complete (): void {
    if (this.closed) return
    this.sink.complete()
    this.closed = true
  }

}
