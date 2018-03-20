/**
 * Created by tushar.mathur on 27/09/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {Periodic} from '../lib/Periodic'
import {ISafeObserver, safeObserver} from '../lib/SafeObserver'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'

class TimerSubscription extends Periodic {
  constructor(
    readonly sink: ISafeObserver<void>,
    scheduler: IScheduler,
    interval: number
  ) {
    super()
    this.sub = scheduler.periodic(this.onEvent.bind(this), interval)
  }
}

class IntervalObservable implements IObservable<void> {
  constructor(private interval: number) {}

  subscribe(observer: IObserver<void>, scheduler: IScheduler): ISubscription {
    return new TimerSubscription(
      safeObserver(observer),
      scheduler,
      this.interval
    )
  }
}

export function interval(interval: number): IObservable<void> {
  return new IntervalObservable(interval)
}
