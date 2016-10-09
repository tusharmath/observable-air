/**
 * Created by tushar.mathur on 07/10/16.
 */

import {ISubscriptionObserver} from '../types/core/ISubscriptionObserver';
import {IObserver} from '../types/core/IObserver';

export function noop () {
}
export function defaultOnError (err: Error) {
  throw err
}


export class SubscriptionObserver<T> implements ISubscriptionObserver<T> {
  closed: boolean;

  constructor (private onNext: (val: T) => void,
               private onError: (err: Error) => void,
               private onComplete: () => void) {
    this.closed = false
  }

  next (val: T): void {
    this.onNext(val)
  }

  error (err: Error): void {
    this.onError(err)
  }

  complete (): void {
    this.onComplete()
    this.closed = true
  }

  static from<T> (observer: IObserver<T> | ((t: T) => void)): ISubscriptionObserver<T> {
    const type = typeof observer
    if (type !== 'object' && type !== 'function') throw new TypeError()
    if (observer instanceof SubscriptionObserver) return observer
    if (typeof observer === 'function')
      return new SubscriptionObserver(observer, defaultOnError, noop)
    return new SubscriptionObserver(
      observer.next ? (t: T) => observer.next(t) : noop,
      observer.error ? (t: Error) => observer.error(t) : defaultOnError,
      observer.complete ? () => observer.complete() : noop
    )
  }
}
