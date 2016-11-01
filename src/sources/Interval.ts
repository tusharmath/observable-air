/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {SafeExecutor} from '../lib/SafeExecutor'
import {PassOnError} from '../lib/PassOnError'


export class IntervalObservable<Number> implements IObservable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: IObserver<number>, scheduler: IScheduler): ISubscription {

    var i = 0
    const f = () => observer.next(i++)
    const task = () => PassOnError<void, number>(SafeExecutor(f), observer)
    return scheduler.setInterval(task, this.interval)
  }
}


export function interval (interval: number): IObservable<number> {
  return new IntervalObservable(interval)
}
