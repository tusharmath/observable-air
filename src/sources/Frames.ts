/**
 * Created by tushar on 28/01/17.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {safeObserver} from '../lib/SafeObserver'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'

class RAFSubscription implements ISubscription {
  observer: IObserver<number>
  subscription: ISubscription
  closed = false

  constructor(private sink: IObserver<void>, private scheduler: IScheduler) {
    this.schedule()
  }

  private schedule() {
    this.subscription = this.scheduler.frame(this.onFrame)
  }

  onFrame = () => {
    if (this.closed) return
    this.sink.next(undefined)
    this.schedule()
  }

  unsubscribe(): void {
    this.closed = true
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
