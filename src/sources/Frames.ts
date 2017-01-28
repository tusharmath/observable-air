/**
 * Created by tushar on 28/01/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {toSafeFunction, SafeFunction} from '../lib/ToSafeFunction'

export class PeriodicSubscription implements Subscription {
  private count = 0
  protected subscription: Subscription
  protected safeSinkNext: SafeFunction<(v: number) => void>

  constructor (protected sink: Observer<number>) {
  }

  dispatch = () => {
    const r = this.safeSinkNext.call(this.sink, this.count++)
    if (r.hasError()) this.sink.error(r.error)
  }

  unsubscribe (): void {
    this.subscription.unsubscribe()
  }

  get closed () {
    return this.subscription.closed
  }

}
class FrameSubscription extends PeriodicSubscription {
  constructor (protected sink: Observer<number>, scheduler: Scheduler) {
    super(sink)
    this.subscription = scheduler.requestAnimationFrames(this.dispatch)
    this.safeSinkNext = toSafeFunction(this.sink.next)
  }
}
class FrameObservable implements Observable<number> {
  subscribe (observer: Observer<number>, scheduler: Scheduler): Subscription {
    return new FrameSubscription(observer, scheduler)
  }
}
export function frames (): Observable<number> {
  return new FrameObservable()
}