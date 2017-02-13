/**
 * Created by tushar on 28/01/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../lib/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {safeObserver} from '../lib/SafeObserver'

class RAFSubscription implements Subscription {
  observer: Observer<number>
  subscription: Subscription
  closed = false

  constructor (private sink: Observer<void>, private scheduler: Scheduler) {
    this.schedule()
  }

  private schedule () {
    this.subscription = this.scheduler.frame(this.onFrame)
  }

  onFrame = () => {
    if (this.closed) return
    this.sink.next(undefined)
    this.schedule()
  }

  unsubscribe (): void {
    this.closed = true
  }
}

class FrameObservable implements Observable<void> {
  subscribe (observer: Observer<void>, scheduler: Scheduler): Subscription {
    return new RAFSubscription(safeObserver(observer), scheduler)
  }
}
export function frames (): Observable<void> {
  return new FrameObservable()
}