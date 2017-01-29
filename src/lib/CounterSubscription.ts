/**
 * Created by tushar on 29/01/17.
 */
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'

export abstract class CounterSubscription implements Subscription {
  private count = 0
  abstract observer: Observer<number>
  abstract subscription: Subscription

  protected onFrame = () => {
    this.observer.next(this.count++)
  }

  unsubscribe (): void {
    this.subscription.unsubscribe()
  }

  get closed () {
    return this.subscription.closed
  }
}
