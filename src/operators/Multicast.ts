/**
 * Created by tushar.mathur on 24/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {LinkedList, LinkedListNode} from '../lib/LinkedList'

export class MulticastSubscription<T> implements ISubscription {
  closed = false
  private node = this.sharedObserver.add(this.observer, this.scheduler)

  constructor (private observer: IObserver<T>,
               private scheduler: IScheduler,
               private sharedObserver: SharedObserver<T>) {
  }

  unsubscribe (): void {
    this.closed = true
    this.sharedObserver.remove(this.node)
  }
}

export class SharedObserver<T> implements IObserver<T> {
  private observers = new LinkedList<IObserver<T>>()
  private subscription: ISubscription

  constructor (private source: IObservable<T>) {
  }

  add (observer: IObserver<T>, scheduler: IScheduler) {
    const node = this.observers.add(observer)
    if (this.observers.length === 1) {
      this.subscription = this.source.subscribe(this, scheduler)
    }
    return node
  }

  remove (node: LinkedListNode<IObserver<T>>) {
    this.observers.remove(node)
    if (this.observers.length === 0) {
      this.subscription.unsubscribe()
    }
  }

  next (val: T): void {
    this.observers.forEach(ob => ob.value.next(val))
  }

  error (err: Error): void {
    this.observers.forEach(ob => ob.value.error(err))
  }

  complete (): void {
    this.observers.forEach(ob => ob.value.complete())
  }

}

export class Multicast<T> implements IObservable<T> {
  constructor (private source: IObservable<T>) {
  }

  private sharedObserver = new SharedObserver(this.source)


  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {

    return new MulticastSubscription(observer, scheduler, this.sharedObserver)
  }
}

export function multicast<T> (source: IObservable<T>) {
  return new Multicast(source)
}
