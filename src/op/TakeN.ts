/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {Observer} from '../Observer';

export class TakeNObservable implements IObservable {
  constructor (private count: number, private source: IObservable) {
  }

  subscribe (observer: IObserver): ISubscription {
    let received = 0
    const subscription = this.source.subscribe(Observer.of({
      next: (val) => {
        observer.next(val)
        received++
        if (received === this.count) {
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

export function takeN (count: number, source: IObservable): IObservable {
  return new TakeNObservable(count, source)
}
