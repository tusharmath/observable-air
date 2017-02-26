import {LinkedListNode, LinkedList} from './LinkedList'
/**
 * Created by tushar.mathur on 27/09/16.
 */

export interface Observer<T> {
  // Receives the next value in the sequence
  next (val: T): void

  // Receives the sequence error
  error  (err: Error): void

  // Receives the sequence completion value
  complete  (): void
}

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
