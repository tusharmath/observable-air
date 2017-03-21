/**
 * Created by tushar.mathur on 27/09/16.
 */
import {IObservable} from '../lib/Observable'
import {ISubscription} from '../lib/Subscription'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {safeObserver} from '../lib/SafeObserver'

class TimerSubscription implements ISubscription {
  closed = false
  subscription: ISubscription


  constructor (private sink: IObserver<void>, scheduler: IScheduler, interval: number) {
    this.subscription = scheduler.periodic(this.onFrame.bind(this), interval)
  }

  onFrame () {
    this.sink.next(undefined)
  }

  unsubscribe (): void {
    this.closed = true
    this.subscription.unsubscribe()
  }
}

class IntervalObservable implements IObservable<void> {
  constructor (private interval: number) {
  }

  subscribe (observer: IObserver<void>, scheduler: IScheduler): ISubscription {
    return new TimerSubscription(safeObserver(observer), scheduler, this.interval)
  }
}

export function interval (interval: number): IObservable<void> {
  return new IntervalObservable(interval)
}
