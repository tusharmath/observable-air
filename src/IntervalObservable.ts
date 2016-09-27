/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/IObservable';
import {ISubscription} from './types/ISubscription';
import {IObserver} from './types/IObserver';

export class IntervalObservable implements IObservable {
  private __interval: number;

  constructor (interval: number) {
    this.__interval = interval
  }

  subscribe (observer: IObserver): ISubscription {
    let i = 0
    let closed = false
    let timer = setInterval(() => observer.next(i++), this.__interval)
    return {
      unsubscribe () {
        clearInterval(timer)
        closed = true
      },
      get closed () {
        return closed
      }
    }
  }
}
