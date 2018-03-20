/**
 * Created by tushar on 28/01/17.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {ISafeObserver, safeObserver} from '../lib/SafeObserver'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'

class RAFSubscription implements ISubscription {
  subscription: ISubscription

  constructor(
    private sink: ISafeObserver<void>,
    private scheduler: IScheduler
  ) {
    this.subscription = this.scheduler.frames(this.onFrame.bind(this))
  }

  onFrame() {
    this.sink.next(undefined)
    if (this.sink.erred) this.unsubscribe()
  }

  unsubscribe(): void {
    this.subscription.unsubscribe()
  }

  get closed() {
    return this.subscription.closed
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
