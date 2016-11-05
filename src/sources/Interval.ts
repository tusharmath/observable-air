/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {TryCatch} from '../lib/TryCatch'
import {SafeValue} from '../lib/SafeValue'

export class IntervalSubscription implements ISubscription {
  count = 0
  private subscription: ISubscription

  constructor (private sink: IObserver<number>, private scheduler: IScheduler, interval: number) {
    this.subscription = scheduler.setInterval(this.dispatch, interval)
  }

  dispatch = () => {
    const r = TryCatch(this.sink.next).call(this.sink, this.count++) as SafeValue<void>
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
