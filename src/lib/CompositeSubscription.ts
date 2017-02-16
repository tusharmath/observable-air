/**
 * Created by tushar.mathur on 12/10/16.
 */
import {Subscription} from './Subscription'
import {LinkedList, LinkedListNode} from './LinkedList'

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
