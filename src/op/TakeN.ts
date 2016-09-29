/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {Observer} from '../Observer';

export class TakeNObservable<T> implements IObservable<T> {
  constructor (private count: number, private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    let received = 0
    const subscription = this.source.subscribe(Observer.of(
      (val: T) => {
        observer.next(val)
        received++
        if (received === this.count) {
          observer.complete()
          subscription.unsubscribe()
        }
      },
      err => observer.error(err),
      () => observer.complete()
    ))
    return subscription
  }

}

export function takeN<T> (count: number, source: IObservable<T>): IObservable<T> {
  return new TakeNObservable(count, source)
}
