/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/core/IObservable';
import {ISubscription} from '../types/core/ISubscription';
import {IObserver} from '../types/core/IObserver';
import {IScheduler} from '../types/IScheduler';
import {DefaultScheduler} from '../schedulers/DefaultScheduler';


export class IntervalObservable<Number> implements IObservable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: IObserver<number>,
             scheduler: IScheduler = DefaultScheduler.of()): ISubscription {

    let i = 0
    var task = () => observer.next(i++)
    const subscription = scheduler.scheduleRepeatedly(task, this.interval)
    observer.start(subscription)
    return subscription
  }
}


export function interval (interval: number): IObservable<number> {
  return new IntervalObservable(interval)
}
