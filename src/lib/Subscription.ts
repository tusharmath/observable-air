/**
 * Created by tushar.mathur on 27/09/16.
 */

import {LinkedList, LinkedListNode} from './LinkedList'
import {ISubscription} from './Subscription'

export interface ISubscription {
  unsubscribe(): void
  readonly closed: boolean
}

export function isSubscription(subscription: ISubscription) {
  return subscription instanceof BaseSubscription || (subscription && typeof subscription.unsubscribe === 'function')
}

export class BaseSubscription implements ISubscription {
  constructor(private f: (() => void), public closed = false) {}

  unsubscribe(): void {
    this.f()
    this.closed = true
  }

  static from(subscription: ISubscription | {(): void} | void): ISubscription {
    if (isSubscription(subscription as ISubscription)) return subscription as ISubscription

    if (typeof subscription === 'function') return new BaseSubscription(subscription as {(): void})

    return new BaseSubscription(() => undefined)
  }
}

export class CompositeSubscription implements ISubscription {
  public closed = false
  private subscriptions: LinkedList<ISubscription>

  constructor() {
    this.subscriptions = new LinkedList<ISubscription>()
  }

  add(d: ISubscription) {
    return this.subscriptions.add(d)
  }

  remove(d?: LinkedListNode<ISubscription>) {
    if (d === undefined) return this.subscriptions.length
    d.value.unsubscribe()
    return this.subscriptions.remove(d)
  }

  unsubscribe(): void {
    if (this.closed) return
    this.closed = true
    this.subscriptions.forEach(this.remove, this)
  }
}
