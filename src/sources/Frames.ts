/**
 * Created by tushar on 28/01/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {safeObserver} from '../lib/SafeObserver'
import {CounterSubscription} from '../lib/CounterSubscription'

class RAFSubscription extends CounterSubscription {
  observer: Observer<number>
  subscription: Subscription

  constructor (sink: Observer<number>, scheduler: Scheduler) {
    super()
    this.subscription = scheduler.requestAnimationFrames(this.onFrame)
    this.observer = safeObserver(sink)
  }
}

class FrameObservable implements Observable<number> {
  subscribe (observer: Observer<number>, scheduler: Scheduler): Subscription {
    return new RAFSubscription(observer, scheduler)
  }
}
export function frames (): Observable<number> {
  return new FrameObservable()
}