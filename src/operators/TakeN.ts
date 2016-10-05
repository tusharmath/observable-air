/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../core-types/IObservable';
import {IObserver} from '../core-types/IObserver';
import {ISubscription} from '../core-types/ISubscription';
import {Observer} from '../lib/Observer';

// TODO: Support slicing
class TakeNObserver<T> extends Observer<T> {
  private count: number;

  constructor (private total: number, private sink: IObserver<T>) {
    super()
    this.count = 0
  }

  onNext (value: T): void {
    this.sink.next(value)
    ++this.count === this.total && this.complete()
  }

  onComplete (): void {
    this.sink.complete()
  }

  onError (error: Error): void {
    this.sink.error(error)
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
