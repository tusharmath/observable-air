/**
 * Created by tushar.mathur on 27/09/16.
 */

import {Observable} from '../types/core/IObservable'
import {Subscription} from '../types/core/ISubscription'
import {Observer} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {toSafeFunction, SafeFunction} from '../lib/ToSafeFunction'

export class IntervalSubscription implements Subscription {
  private count = 0
  private subscription: Subscription
  private safeSinkNext: SafeFunction<(v: number) => void>

  constructor (private sink: Observer<number>, private scheduler: IScheduler, interval: number) {
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

export class IntervalObservable<Number> implements Observable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: Observer<number>, scheduler: IScheduler): Subscription {
    return new IntervalSubscription(observer, scheduler, this.interval)
  }
}


export function interval (interval: number): Observable<number> {
  return new IntervalObservable(interval)
}
