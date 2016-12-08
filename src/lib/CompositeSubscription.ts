/**
 * Created by tushar.mathur on 12/10/16.
 */

import {Subscription} from '../types/core/ISubscription'
import {LinkedList, LinkedListNode} from './LinkedList'

const unsubscribe = (x: LinkedListNode<Subscription>) => x.value.unsubscribe()

export class CompositeSubscription implements Subscription {
  public closed = false
  private subscriptions: LinkedList<Subscription>

  constructor () {
    this.subscriptions = new LinkedList<Subscription>()
  }

  add (d: Subscription) {
    return this.subscriptions.add(d)
  }

  remove (d: LinkedListNode<Subscription>) {
    d.value.unsubscribe()
    return this.subscriptions.remove(d)
  }

  unsubscribe (): void {
    this.subscriptions.forEach(unsubscribe)
    this.closed = true
  }
}
