/**
 * Created by tushar.mathur on 12/10/16.
 */

import {ISubscription} from '../types/core/ISubscription'
import {LinkedList, LinkedListNode} from './LinkedList'

const unsubscribe = (x: ISubscription) => x.unsubscribe()

export class CompositeSubscription implements ISubscription {
  public closed = false
  private subscriptions: LinkedList<ISubscription>

  constructor () {
    this.subscriptions = new LinkedList<ISubscription>()
  }

  add (d: ISubscription) {
    return this.subscriptions.add(d)
  }

  remove (d: LinkedListNode<ISubscription>) {
    d.value.unsubscribe()
    return this.subscriptions.remove(d)
  }

  unsubscribe (): void {
    this.subscriptions.forEach(unsubscribe)
    this.closed = true
  }
}
