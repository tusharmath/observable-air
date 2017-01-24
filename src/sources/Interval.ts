/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {toSafeFunction, SafeFunction} from '../lib/ToSafeFunction'

export class IntervalSubscription implements Subscription {
  private count = 0
  private subscription: Subscription
  private safeSinkNext: SafeFunction<(v: number) => void>

  constructor (private sink: Observer<number>, scheduler: Scheduler, interval: number) {
    this.subscription = scheduler.setInterval(this.dispatch, interval)
    this.safeSinkNext = toSafeFunction(this.sink.next)
  }

  dispatch = () => {
    const r = this.safeSinkNext.call(this.sink, this.count++)
    if (r.hasError()) this.sink.error(r.error)
  }

  unsubscribe (): void {
    this.subscription.unsubscribe()
  }

  get closed () {
    return this.subscription.closed
  }
}

export class Interval implements Observable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: Observer<number>, scheduler: Scheduler): Subscription {
    return new IntervalSubscription(observer, scheduler, this.interval)
  }
}
