/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {toSafeFunction} from '../lib/ToSafeFunction'
import {PeriodicSubscription} from './Frames'

class IntervalSubscription extends PeriodicSubscription {
  constructor (sink: Observer<number>, scheduler: Scheduler, interval: number) {
    super(sink)
    this.subscription = scheduler.setInterval(this.dispatch, interval)
    this.safeSinkNext = toSafeFunction(this.sink.next)
  }
}

class IntervalObservable implements Observable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: Observer<number>, scheduler: Scheduler): Subscription {
    return new IntervalSubscription(observer, scheduler, this.interval)
  }
}

export function interval (interval: number): Observable<number> {
  return new IntervalObservable(interval)
}
