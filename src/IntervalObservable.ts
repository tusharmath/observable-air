/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from './types/IObservable';
import {ISubscription} from './types/ISubscription';
import {IObserver} from './types/IObserver';

export class IntervalObservable implements IObservable {
  constructor (private interval: number) {

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
