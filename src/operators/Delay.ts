/**
 * Created by tushar on 29/01/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {safeObserver} from '../lib/SafeObserver'

class DelayObserver<T> implements Observer<T> {
  constructor (private timeout: number, private sink: Observer<T>, private scheduler: Scheduler) {
  }

  private nextDelayed (value: T) {
    this.sink.next(value)
  }

  private completeDelayed = () => {
    this.sink.complete()
  }

  next (val: T): void {
    this.scheduler.setTimeout(this.nextDelayed.bind(this, val), this.timeout)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.scheduler.setTimeout(this.completeDelayed, this.timeout)
  }
}

class DelayObservable<T> implements Observable<T> {
  constructor (private timeout: number, private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new DelayObserver(this.timeout, safeObserver(observer), scheduler), scheduler)
  }
}

export const delay = <T> (timeout: number, source: Observable<T>): Observable<T> => new DelayObservable(timeout, source)