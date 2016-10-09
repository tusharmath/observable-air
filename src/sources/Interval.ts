/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/core/IObservable';
import {ISubscription} from '../types/core/ISubscription';
import {IObserver} from '../types/core/IObserver';
import {IScheduler} from '../types/IScheduler';
import {DefaultScheduler} from '../scheduling/DefaultScheduler';
import {ILazySubscription} from '../types/ILazySubscription';
import {SafeExecutor} from '../lib/SafeExecutor';
import {PassOnError} from '../lib/PassOnError';


export class IntervalObserver implements ILazySubscription {
  closed: boolean;
  private count: number;

  constructor (private sink: IObserver<number>) {
    this.count = 0
    this.closed = false
  }

  run (): ILazySubscription {
    this.sink.next(this.count++)
    return this;
  }

  unsubscribe (): void {
    this.closed = true
  }
}

export class IntervalObservable<Number> implements IObservable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: IObserver<number>,
             scheduler: IScheduler = DefaultScheduler.of()): ISubscription {

    let i = 0
    var f = () => observer.next(i++);
    var task = () => PassOnError<void, number>(SafeExecutor(f), observer)
    return scheduler.scheduleRepeatedly(task, this.interval)
  }
}


export function interval (interval: number): IObservable<number> {
  return new IntervalObservable(interval)
}
