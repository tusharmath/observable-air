/**
 * Created by tushar.mathur on 27/09/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {ISafeObserver, safeObserver} from '../lib/SafeObserver'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'

class TimerSubscription implements ISubscription {
  subscription: ISubscription

  constructor(
    private sink: ISafeObserver<void>,
    scheduler: IScheduler,
    interval: number
  ) {
    this.subscription = scheduler.periodic(this.onEvent.bind(this), interval)
  }

  onEvent() {
    this.sink.next(undefined)
    if (this.sink.erred) this.unsubscribe()
  }

  get closed() {
    return this.subscription.closed
  }

  unsubscribe(): void {
    this.subscription.unsubscribe()
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
