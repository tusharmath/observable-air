/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {toSafeFunction, SafeFunction} from '../lib/TryCatch'

export class IntervalSubscription implements ISubscription {
  private count = 0
  private subscription: ISubscription
  private safeSinkNext: SafeFunction<(v: number) => void>

  constructor (private sink: IObserver<number>, private scheduler: IScheduler, interval: number) {
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

export class IntervalObservable<Number> implements IObservable<number> {
  constructor (private interval: number) {
  }

  subscribe (observer: IObserver<number>, scheduler: IScheduler): ISubscription {
    return new IntervalSubscription(observer, scheduler, this.interval)
  }
}


export function interval (interval: number): IObservable<number> {
  return new IntervalObservable(interval)
}
