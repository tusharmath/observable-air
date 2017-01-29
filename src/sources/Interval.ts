/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {safeObserver} from '../lib/SafeObserver'
import {CounterSubscription} from '../lib/CounterSubscription'

class TimerSubscription extends CounterSubscription {
  observer: Observer<number>
  subscription: Subscription

  constructor (sink: Observer<number>, scheduler: Scheduler, interval: number) {
    super()
    this.subscription = scheduler.setInterval(this.onFrame, interval)
    this.observer = safeObserver(sink)
  }
}

class IntervalObservable implements Observable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: Observer<number>, scheduler: Scheduler): Subscription {
    return new TimerSubscription(observer, scheduler, this.interval)
  }
}

export function interval (interval: number): Observable<number> {
  return new IntervalObservable(interval)
}
