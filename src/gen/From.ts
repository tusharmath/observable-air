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
function transmitAll<T> (observer: IObserver<T>, list: Array<T>) {
  for (var i = 0; i < list.length - 1; i++) {
    observer.next(list[i])
  }
}
export class FromObservable<T> implements IObservable<T> {
  constructor (private list: Array<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    transmitAll<T>(observer, this.list)
    observer.complete()
    return subscription
  }
}

export function from<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
