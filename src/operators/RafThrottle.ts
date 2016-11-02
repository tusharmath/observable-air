/**
 * Created by tushar.mathur on 02/11/16.
 */

import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {IObserver} from '../types/core/IObserver'
import {CompositeSubscription} from '../lib/CompositeSubscription'
import {LinkedListNode} from '../lib/LinkedList'

export class RafObserver<T> implements IObserver<T> {
  private completed = false
  private queue: LinkedListNode<ISubscription>
  private canFlush = true

  constructor (private sink: IObserver<T>,
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

export class RafThrottle<T> implements IObservable<T> {
  constructor (private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    cSub.add(this.source.subscribe(new RafObserver(observer, scheduler, cSub), scheduler))
    return cSub
  }
}

export function rafThrottle<T> (source: IObservable<T>) {
  return new RafThrottle(source)
}
