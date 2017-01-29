/**
 * Created by tushar on 28/01/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {asyncSubscription} from '../lib/AsyncSubscription'

class FrameObservable implements Observable<number> {
  subscribe (observer: Observer<number>, scheduler: Scheduler): Subscription {
    return asyncSubscription((t) => scheduler.requestAnimationFrames(t.onNext), observer)
  }
}
export function frames (): Observable<number> {
  return new FrameObservable()
}