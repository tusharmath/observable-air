/**
 * Created by tushar.mathur on 24/10/16.
 */
import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Scheduler} from '../lib/Scheduler'
import {Subscription} from '../lib/Subscription'
import {LinkedListNode} from '../lib/LinkedList'
import {CompositeObserver} from '../lib/CompositeObserver'

class MulticastSubscription<T> implements Subscription {
  closed = false
  private node = this.sharedObserver.addObserver(this.observer, this.scheduler)

  constructor (private observer: Observer<T>,
               private scheduler: Scheduler,
               private sharedObserver: MulticastObserver<T>) {
  }

  unsubscribe (): void {
    this.closed = true
    this.sharedObserver.removeObserver(this.node)
  }
}

class MulticastObserver<T> extends CompositeObserver<T> {
  private subscription: Subscription

  constructor (private source: Observable<T>) {
    super()
  }

  addObserver (observer: Observer<T>, scheduler: Scheduler) {
    const node = this.add(observer)
    if (this.length === 1) {
      this.subscription = this.source.subscribe(this, scheduler)
    }
    return node
  }

  removeObserver (node: LinkedListNode<Observer<T>>) {
    this.remove(node)
    if (this.length === 0) {
      this.subscription.unsubscribe()
    }
  }
}

class Multicast<T> implements Observable<T> {
  private sharedObserver = new MulticastObserver(this.source)

  constructor (private source: Observable<T>) {
  }


  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return new MulticastSubscription(observer, scheduler, this.sharedObserver)
  }
}

export function multicast<T> (source: Observable<T>): Observable<T> {
  return new Multicast(source)
}
