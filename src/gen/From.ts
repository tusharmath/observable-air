/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/IObservable';
import {ISubscription} from '../types/ISubscription';
import {IObserver} from '../types/IObserver';

function noop () {
}
const unsubscribe = noop
const subscription = {unsubscribe, closed: true};
export class FromObservable<T> implements IObservable {
  constructor (private list: Array<T>) {
  }

  subscribe (observer: IObserver): ISubscription {
    for (var i = 0; i < this.list.length; i++) {
      observer.next(this.list[i])
    }
    observer.complete()
    return subscription
  }
}

export function from<T> (list: Array<T>): IObservable {
  return new FromObservable(list)
}
