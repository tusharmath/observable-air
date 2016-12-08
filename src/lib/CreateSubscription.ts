/**
 * Created by tushar.mathur on 16/10/16.
 */

import {ISubscription} from '../types/core/ISubscription'
import {ITask} from '../types/ITask'

export function isSubscription (subscription: ISubscription) {
  return subscription instanceof CreateSubscription || (subscription && typeof subscription.unsubscribe === 'function')
}

export class CreateSubscription implements ISubscription {
  constructor (private f: (() => void), public closed = false) {
  }

  unsubscribe (): void {
    this.f()
    this.closed = true
  }

  static from (subscription: ISubscription | ITask | void): ISubscription {
    if (isSubscription(subscription as ISubscription))
      return subscription as ISubscription

    if (typeof subscription === 'function')
      return new CreateSubscription(subscription as ITask)

    return new CreateSubscription(() => undefined)
  }
}

