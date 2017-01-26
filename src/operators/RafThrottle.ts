/**
 * Created by tushar.mathur on 02/11/16.
 */

import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../types/Scheduler'
import {Observer} from '../types/core/Observer'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'

class RafObserver<T> implements Observer<T> {
  private completed = false
  private queue: LinkedListNode<Subscription>
  private canFlush = true

  constructor (private sink: Observer<T>,
               private scheduler: Scheduler,
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

class RafThrottle<T> implements Observable<T> {
  constructor (private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const cSub = new CompositeSubscription()
    cSub.add(this.source.subscribe(new RafObserver(observer, scheduler, cSub), scheduler))
    return cSub
  }
}

export function rafThrottle<T> (source: Observable<T>) {
  return new RafThrottle(source)
}
