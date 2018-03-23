/**
 * Created by tushar on 28/01/17.
 */
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {Periodic} from '../internal/Periodic'
import {ISafeObserver, safeObserver} from '../internal/SafeObserver'
import {ISubscription} from '../internal/Subscription'
import {IScheduler} from '../schedulers/Scheduler'

class RAFSubscription extends Periodic {
  constructor(readonly sink: ISafeObserver<void>, scheduler: IScheduler) {
    super()
    this.sub = scheduler.frames(this.onEvent.bind(this))
  }
}

class FrameObservable implements IObservable<void> {
  subscribe(observer: IObserver<void>, scheduler: IScheduler): ISubscription {
    return new RAFSubscription(safeObserver(observer), scheduler)
  }
}

export function frames(): IObservable<void> {
  return new FrameObservable()
}
