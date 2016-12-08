/**
 * Created by tushar.mathur on 17/10/16.
 */

import {Observable} from '../types/core/IObservable'
import {Observer} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {Subscription} from '../types/core/ISubscription'
import {CompositeSubscription} from '../lib/CompositeSubscription'

export class MergeObserver<T> implements Observer<T> {
  private count = 0

  constructor (private total: number, private sink: Observer<T>) {
  }

  next (val: T): void {
    this.sink.next(val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.count++
    if (this.count === this.total) {
      this.sink.complete()
    }
  }
}

export class MergeObservable<T> implements Observable<T> {
  constructor (private sources: Array<Observable<T>>) {
  }

  subscribe (observer: Observer<T>, scheduler: IScheduler): Subscription {
    const cSub = new CompositeSubscription()
    const mergeObserver = new MergeObserver(this.sources.length, observer)
    for (var i = 0; i < this.sources.length; ++i) {
      cSub.add(this.sources[i].subscribe(mergeObserver, scheduler))
    }
    return cSub
  }
}

export function merge <T> (...sources: Array<Observable<T>>) {
  return new MergeObservable(sources)
}
