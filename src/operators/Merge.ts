/**
 * Created by tushar.mathur on 17/10/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {ISubscription, CompositeSubscription} from '../lib/Subscription'
import {IScheduler} from '../lib/Scheduler'

class MergeObserver<T> implements IObserver<T> {
  private count = 0

  constructor (private total: number, private sink: IObserver<T>) {
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

class MergeObservable<T> implements IObservable<T> {
  constructor (private sources: Array<IObservable<T>>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const mergeObserver = new MergeObserver(this.sources.length, observer)
    for (var i = 0; i < this.sources.length; ++i) {
      cSub.add(this.sources[i].subscribe(mergeObserver, scheduler))
    }
    return cSub
  }
}

export function merge <T> (...sources: Array<IObservable<T>>): IObservable<T> {
  return new MergeObservable(sources)
}
