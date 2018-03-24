/**
 * Created by tushar.mathur on 27/09/16.
 */

import {LinkedList, LinkedListNode} from '../LinkedList'

export class CompositeObserver<T> implements IObserver<T> {
  private observers = new LinkedList<IObserver<T>>()

  get length() {
    return this.observers.length
  }

  add(observer: IObserver<T>) {
    return this.observers.add(observer)
  }

  remove(node: LinkedListNode<IObserver<T>>) {
    return this.observers.remove(node)
  }

  next(val: T): void {
    var node = this.observers.head()
    while (node) {
      node.value.next(val)
      node = node.right
    }
  }

  error(err: Error): void {
    var node = this.observers.head()
    while (node) {
      node.value.error(err)
      node = node.right
    }
  }

  complete(): void {
    var node = this.observers.head()
    while (node) {
      node.value.complete()
      node = node.right
    }
  }
}
