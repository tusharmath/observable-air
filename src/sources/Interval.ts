/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {safeObserver} from '../lib/SafeObserver'

class TimerSubscription implements Subscription {
  closed = false
  subscription: Subscription


  constructor (private sink: Observer<void>, scheduler: Scheduler, interval: number) {
    this.subscription = scheduler.setInterval(this.onFrame.bind(this), interval)
  }

  onFrame () {
    this.sink.next(undefined)
  }

  unsubscribe (): void {
    this.closed = true
    this.subscription.unsubscribe()
  }
}

class IntervalObservable implements Observable<void> {
  constructor (private interval: number) {
  }

  subscribe (observer: Observer<void>, scheduler: Scheduler): Subscription {
    return new TimerSubscription(safeObserver(observer), scheduler, this.interval)
  }
}

export function interval (interval: number): Observable<void> {
  return new IntervalObservable(interval)
}
