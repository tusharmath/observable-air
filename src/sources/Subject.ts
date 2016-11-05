/**
 * Created by tushar.mathur on 05/11/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {LinkedListNode} from '../lib/LinkedList'
import {CompositeObserver} from '../lib/CompositeObserver'

export class SubjectSubscription<T> implements ISubscription {
  closed: boolean = false

  constructor (private subject: Subject<T>, public node: LinkedListNode<IObserver<T>>) {
  }

  unsubscribe (): void {
    this.subject.unsubscribe(this)
    this.closed = true
  }
}

export class Subject<T> implements IObservable<T>, IObserver<T> {
  private observers = new CompositeObserver<T>()

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const node = this.observers.add(observer)
    return new SubjectSubscription(this, node)
  }

  unsubscribe (subscription: SubjectSubscription<T>) {
    this.observers.remove(subscription.node)
  }

  next (val: T): void {
    this.observers.next(val)
  }

  error (err: Error): void {
    this.observers.error(err)
  }

  complete (): void {
    this.observers.complete()
  }

}

export function subject<T> () {
  return new Subject<T>()
}
