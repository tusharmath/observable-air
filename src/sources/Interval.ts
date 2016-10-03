/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {ISubscription} from '../types/ISubscription';
import {IObserver} from '../types/IObserver';
import {IScheduler} from '../types/IScheduler';
import {TimeoutScheduler} from '../schedulers/TimeoutScheduler';
import {ITask} from '../types/ITask';
import {RepeatedTask} from '../lib/RepeatedTask';

class CounterTask implements ITask {
  private count: number;

  constructor (private observer: IObserver<number>) {
    this.count = 0
  }

  run (): void {
    this.observer.next(this.count++)
  }
}

export class IntervalObservable<Number> implements IObservable<number> {
  private __closed: boolean

  constructor (
    private interval: number,
    private scheduler: IScheduler
  ) {
    this.__closed = false
  }

  subscribe (observer: IObserver<number>): ISubscription {
    const repeatedTask = new RepeatedTask(new CounterTask(observer), this.interval, this.scheduler);
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
