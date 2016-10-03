/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {ISubscription} from '../types/ISubscription';
import {IObserver} from '../types/IObserver';
import {IScheduler} from '../types/IScheduler';
import {DefaultScheduler} from '../schedulers/DefaultScheduler';
import {IScheduled} from '../types/IScheduled';
import {IDisposable} from '../types/IDisposable';

class CounterTask implements IScheduled, IDisposable {
  disposed: boolean;
  private count: number;

  constructor (
    private observer: IObserver<number>,
    private scheduler: IScheduler,
    private  interval: number
  ) {
    this.count = 0
    this.disposed = false
  }

  run (): void {
    this.observer.next(this.count++)
    if (!this.disposed) this.scheduler.schedule(this, this.interval);
  }

  dispose (): void {
    this.disposed = true
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
    const task = new CounterTask(observer, this.scheduler, this.interval);
    task.run()
    return {
      unsubscribe () {
        task.dispose()
        this.__closed = true
      },
      get closed () {
        return this.__closed
      }
    }
  }
}


export function interval (interval: number, scheduler: IScheduler = DefaultScheduler.of()): IObservable<number> {
  return new IntervalObservable(interval, scheduler)
}
