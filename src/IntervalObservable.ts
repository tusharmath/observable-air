/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/IObservable';
import {ISubscription} from './types/ISubscription';
import {IObserver} from './types/IObserver';

export class IntervalObservable implements IObservable {
  private interval: number;

  constructor (interval: number) {
    this.interval = interval
  }

  static of (interval: number) {
    return new IntervalObservable(interval)
  }

  subscribe (observer: IObserver): ISubscription {
    let i = 0
    let closed = false
    let timer = setInterval(() => observer.next(i++), this.interval)
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
