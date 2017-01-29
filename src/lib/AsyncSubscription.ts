/**
 * Created by tushar on 29/01/17.
 */
import {toSafeFunction, SafeFunction} from './ToSafeFunction'
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'

class AsyncSubscription implements Subscription {
  private count = 0
  private safeSinkNext: SafeFunction<(v: number) => void>
  private subscription: Subscription

  constructor (private sink: Observer<number>, fn: (t: AsyncSubscription) => Subscription) {
    this.safeSinkNext = toSafeFunction(this.sink.next)
    this.subscription = fn(this)
  }

  onNext = () => {
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

export const asyncSubscription = (fn: (t: AsyncSubscription) => Subscription, sink: Observer<number>) => new AsyncSubscription(sink, fn)
