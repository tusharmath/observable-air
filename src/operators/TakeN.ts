/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';


class TakeNObserver<T> implements IObserver<T> {
  private count: number;
  private completed: boolean;

  constructor (private total: number, private sink: IObserver<T>) {
    this.count = 0
    this.completed = false
  }

  next (val: T): void {
    if (++this.count <= this.total && this.completed === false) {
      this.sink.next(val)
    }
    if (this.count === this.total) {
      this.complete()
    }
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    if (this.completed === false) {
      this.sink.complete()
      this.completed = true
    }
  }
}

export class TakeNObservable<T> implements IObservable<T> {
  constructor (private total: number, private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    return this.source.subscribe(new TakeNObserver(this.total, observer))
  }

}

export function takeN<T> (count: number, source: IObservable<T>): IObservable<T> {
  return new TakeNObservable(count, source)
}
