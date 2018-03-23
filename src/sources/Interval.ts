/**
 * Created by tushar.mathur on 27/09/16.
 */
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {Periodic} from '../internal/Periodic'
import {ISafeObserver, safeObserver} from '../internal/SafeObserver'
import {ISubscription} from '../internal/Subscription'
import {IScheduler} from '../schedulers/Scheduler'

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
