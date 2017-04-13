/**
 * Created by tushar.mathur on 27/09/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {safeObserver} from '../lib/SafeObserver'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'

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
