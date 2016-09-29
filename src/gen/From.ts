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
function transmitAll<T> (obr: IObserver<T>, list: Array<T>) {
  for (var i = 0; i < list.length - 1; i++) {
    obr.next(list[i])
  }
}
export class FromObservable<T> implements IObservable<T> {
  constructor (private l: Array<T>) {
  }

  subscribe (obr: IObserver<T>): ISubscription {
    transmitAll<T>(obr, this.l)
    obr.complete()
    return subscription
  }
}

export function from<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
