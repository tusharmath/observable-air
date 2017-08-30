/**
 * Created by tushar.mathur on 27/09/16.
 */

import {LinkedList, LinkedListNode} from './LinkedList'
import {SubscriberFunctionReturnType} from './SubscriberFunction'
import {ISubscription} from './Subscription'

export interface ISubscription {
  unsubscribe(): void
  readonly closed: boolean
}

export class Subscription implements ISubscription {
  closed: boolean = false

  constructor(private dispose: SubscriberFunctionReturnType) {}

  unsubscribe(): void {
    if (this.dispose) {
      if (typeof this.dispose === 'function') this.dispose()
      else if ('unsubscribe' in this.dispose) this.dispose.unsubscribe()
    }
    this.closed = true
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
