/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {ISubscription} from '../types/ISubscription';
import {IObserver} from '../types/IObserver';
import {IScheduler} from '../types/IScheduler';
import {TimeoutScheduler} from '../schedulers/DefaultScheduler';
import {RepeatedTask} from '../lib/RepeatedTask';


export class IntervalObservable<Number> implements IObservable<number> {
  private __closed: boolean

  constructor (
    private interval: number,
    private scheduler: IScheduler
  ) {
    this.__closed = false
  }

  subscribe (observer: IObserver<number>): ISubscription {
    let i = 0
    const repeatedTask = new RepeatedTask(() => observer.next(i++), this.interval, this.scheduler);
    repeatedTask.run()
    return {
      unsubscribe () {
        repeatedTask.dispose()
        this.__closed = true
      },
      get closed () {
        return this.__closed
      }
    }
  }
}


export function interval (interval: number, scheduler: IScheduler = TimeoutScheduler.of()): IObservable<number> {
  return new IntervalObservable(interval, scheduler)
}
