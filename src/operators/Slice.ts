/**
 * Created by tushar.mathur on 27/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../types/Scheduler'

class SliceObserver<T> implements Observer<T> {
  closed: boolean
  private index: number
  private subscription: Subscription

  constructor (private from: number,
               private total: number,
               private sink: Observer<T>) {
    this.closed = false
    this.index = 0
  }

  start (subscription: Subscription) {
    this.subscription = subscription
  }

  next (value: T): void {
    const diff = this.index++ - this.from
    if (diff >= 0 && diff < this.total) {
      this.sink.next(value)
    }
    if (diff + 1 === this.total) this.end()
  }

  private end () {
    this.subscription.unsubscribe()
    this.complete()
  }

  complete (): void {
    if (this.closed) return
    this.sink.complete()
    this.closed = true
  }

  error (error: Error): void {
    if (this.closed) return
    this.sink.error(error)
  }
}

export class SliceObservable<T> implements Observable<T> {
  constructor (private start: number, private total: number, private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    const sliceObserver = new SliceObserver(this.start, this.total, observer)
    const subscription = this.source.subscribe(sliceObserver, scheduler)
    sliceObserver.start(subscription)
    return subscription
  }

}

export const slice = function (start: number, count: number, source: Observable<any>) {
  return new SliceObservable(start, count, source)
}
