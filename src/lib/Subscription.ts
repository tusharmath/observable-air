/**
 * Created by tushar.mathur on 27/09/16.
 */

import {Subscription} from './Subscription'
import {LinkedListNode, LinkedList} from './LinkedList'

export interface Subscription {
  unsubscribe(): void
  readonly closed: boolean
}

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

  static from (subscription: Subscription | {(): void} | void): Subscription {
    if (isSubscription(subscription as Subscription))
      return subscription as Subscription

    if (typeof subscription === 'function')
      return new BaseSubscription(subscription as {(): void})

    return new BaseSubscription(() => undefined)
  }
}


export class CompositeSubscription implements Subscription {
  public closed = false
  private subscriptions: LinkedList<Subscription>

  constructor () {
    this.subscriptions = new LinkedList<Subscription>()
  }

  add (d: Subscription) {
    return this.subscriptions.add(d)
  }

  remove (d?: LinkedListNode<Subscription>) {
    if (d === undefined) return this.subscriptions.length
    d.value.unsubscribe()
    return this.subscriptions.remove(d)
  }

  unsubscribe (): void {
    if (this.closed) return
    this.closed = true
    this.subscriptions.forEach(this.remove, this)
  }
}