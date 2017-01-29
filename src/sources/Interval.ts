/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {asyncSubscription} from '../lib/AsyncSubscription'


class IntervalObservable implements Observable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: Observer<number>, scheduler: Scheduler): Subscription {
    return asyncSubscription((t) => scheduler.setInterval(t.onNext, this.interval), observer)
  }
}

export function interval (interval: number): Observable<number> {
  return new IntervalObservable(interval)
}
