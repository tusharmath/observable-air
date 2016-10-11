/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/core/IObservable';
import {IObserver} from '../types/core/IObserver';
import {ISubscription} from '../types/core/ISubscription';
import {IScheduler} from '../types/IScheduler';

function isRange (current: number, start: number, total: number) {
  return current >= start && current - start < total
}

class SliceObserver<T> implements IObserver<T> {
  closed: boolean;
  private current: number;

  constructor (private start: number,
               private total: number,
               private sink: IObserver<T>) {
    this.closed = false
    this.current = 0
  }

  next (value: T): void {
    const diff = this.current++ - this.start
    if (diff >= 0 && diff < this.total) this.sink.next(value)
    if (diff + 1 === this.total) this.complete()
  }

  complete (): void {
    if (this.closed) return
    this.sink.complete()
    this.closed = true
  }

  error (error: Error): void {
    this.sink.error(error)
  }
}

export class SliceObservable<T> implements IObservable<T> {
  constructor (private start: number, private total: number, private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new SliceObserver(this.start, this.total, observer), scheduler)
  }

}

export function slice<T> (start: number, count: number, source: IObservable<T>): IObservable<T> {
  return new SliceObservable(start, count, source)
}
