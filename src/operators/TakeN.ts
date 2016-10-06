/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../core-types/IObservable';
import {IObserver} from '../core-types/IObserver';
import {ISubscription} from '../core-types/ISubscription';
import {IScheduler} from '../types/IScheduler';

// TODO: Support slicing
class TakeNObserver<T> implements IObserver<T> {
  closed: boolean;
  private count: number;

  constructor (private total: number, private sink: IObserver<T>) {
    this.closed = false
    this.count = 0
  }

  next (value: T): void {
    if (this.closed) return
    this.sink.next(value)
    ++this.count === this.total && this.complete()
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

export class TakeNObservable<T> implements IObservable<T> {
  constructor (private total: number, private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new TakeNObserver(this.total, observer), scheduler)
  }

}

export function takeN<T> (count: number, source: IObservable<T>): IObservable<T> {
  return new TakeNObservable(count, source)
}
