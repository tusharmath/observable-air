/**
 * Created by tushar.mathur on 25/10/16.
 */

import {Observer} from '../types/core/IObserver'
import {LinkedList, LinkedListNode} from './LinkedList'


export class CompositeObserver<T> implements Observer<T> {
  private observers = new LinkedList<Observer<T>>()

  get length () {
    return this.observers.length
  }

  add (observer: Observer<T>) {
    return this.observers.add(observer)
  }

  remove (node: LinkedListNode<Observer<T>>) {
    return this.observers.remove(node)
  }

  next (val: T): void {
    var node = this.observers.head()
    while (node) {
      node.value.next(val)
      node = node.right
    }
  }

  error (err: Error): void {
    var node = this.observers.head()
    while (node) {
      node.value.error(err)
      node = node.right
    }
  }

  complete (): void {
    var node = this.observers.head()
    while (node) {
      node.value.complete()
      node = node.right
    }
  }
}
