/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {Observer} from '../Observer';

export class TakeNObservable implements IObservable {
  private __count: number;
  private __source: IObservable;

  constructor (count: number, source: IObservable) {
    this.__count = count
    this.__source = source
  }

  subscribe (observer: IObserver): ISubscription {
    let received = 0
    const subscription = this.__source.subscribe(Observer.of({
      next: (val) => {
        observer.next(val)
        received++
        if (received === this.__count) {
          observer.complete()
          subscription.unsubscribe()
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    }))
    return subscription
  }

}
