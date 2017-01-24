/**
 * Created by tushar.mathur on 17/10/16.
 */

import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
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

export class Merge<T> implements Observable<T> {
  constructor (private sources: Array<Observable<T>>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const cSub = new CompositeSubscription()
    const mergeObserver = new MergeObserver(this.sources.length, observer)
    for (var i = 0; i < this.sources.length; ++i) {
      cSub.add(this.sources[i].subscribe(mergeObserver, scheduler))
    }
    return cSub
  }
}
