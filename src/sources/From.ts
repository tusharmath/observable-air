/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/IObservable';
import {ISubscription} from '../types/ISubscription';
import {IObserver} from '../types/IObserver';

const unsubscribe = function () {
}
const subscription = {unsubscribe, closed: true};

export class FromObservable<T> implements IObservable<T> {
  constructor (private array: Array<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    for (var i = 0; i < this.array.length; ++i) {
      observer.next(this.array[i])
    }
    observer.complete()
    return subscription
  }
}

export function from<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
