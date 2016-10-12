/**
 * Created by tushar.mathur on 02/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'

interface ITapper<T> {
  (f: T): void
}

export class TapObserver<T> implements IObserver<T> {
  constructor (private tapper: ITapper<T>, private observer: IObserver<T>) {

  }

  next (val: T): void {
    this.tapper(val)
    this.observer.next(val)
  }

  error (err: Error): void {
    this.observer.error(err)
  }

  complete (): void {
    this.observer.complete()
  }

}

export class TapObservable<T> implements IObservable<T> {
  constructor (private tapper: ITapper<T>, private source: IObservable<T>) {

  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new TapObserver(this.tapper, observer), scheduler)
  }
}

export function tap<T> (tapper: ITapper<T>, source: IObservable<T>): TapObservable<T> {
  return new TapObservable(tapper, source)
}
