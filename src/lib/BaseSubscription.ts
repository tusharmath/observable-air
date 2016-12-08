/**
 * Created by tushar.mathur on 16/10/16.
 */

import {Subscription} from '../types/core/Subscription'
import {ITask} from '../types/ITask'

export function isSubscription (subscription: Subscription) {
  return subscription instanceof BaseSubscription || (subscription && typeof subscription.unsubscribe === 'function')
}

export class BaseSubscription implements Subscription {
  constructor (private f: (() => void), public closed = false) {
  }

  unsubscribe (): void {
    this.f()
    this.closed = true
  }

  static from (subscription: Subscription | ITask | void): Subscription {
    if (isSubscription(subscription as Subscription))
      return subscription as Subscription

    if (typeof subscription === 'function')
      return new BaseSubscription(subscription as ITask)

    return new BaseSubscription(() => undefined)
  }
}

