/**
 * Created by tushar.mathur on 02/11/16.
 */

import {Observable} from '../types/core/IObservable'
import {Subscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Observer} from '../types/core/IObserver'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'

export class RafObserver<T> implements Observer<T> {
  private completed = false
  private queue: LinkedListNode<Subscription>
  private canFlush = true

  constructor (private sink: Observer<T>,
               private scheduler: IScheduler,
               private cSub: CompositeSubscription) {
    this.flush = this.flush.bind(this)
  }

  next (val: T): void {
    if (this.canFlush) {
      this.canFlush = false
      this.sink.next(val)
      this.queue = this.cSub.add(this.scheduler.requestAnimationFrame(this.flush))
    }
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.completed = true
    this.sink.complete()
    this.cSub.remove(this.queue)
  }

  private flush () {
    this.canFlush = true
    this.cSub.remove(this.queue)
  }
}

export class RafThrottle<T> implements Observable<T> {
  constructor (private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: IScheduler): Subscription {
    const cSub = new CompositeSubscription()
    cSub.add(this.source.subscribe(new RafObserver(observer, scheduler, cSub), scheduler))
    return cSub
  }
}

export function rafThrottle<T> (source: Observable<T>) {
  return new RafThrottle(source)
}
