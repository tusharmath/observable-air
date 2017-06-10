/**
 * Created by tushar on 10/06/17.
 */

import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {CompositeSubscription, ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'

class SourceObserver<T> implements IObserver<T> {
  constructor (private sink: IObserver<T>, private sub: ISubscription) {}

  next (val: T): void {
    this.sink.next(val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
    this.sub.unsubscribe()
  }
}
class SignalObserver<T> implements IObserver<any> {
  constructor (private sink: IObserver<T>,
               private sub: ISubscription) {}

  next (val: any): void {
    this.sub.unsubscribe()
    this.sink.complete()
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
  }
}
class TakeUntil<T> implements IObservable<T> {
  constructor (private source: IObservable<T>,
               private signal: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    cSub.add(this.source.subscribe(new SourceObserver(observer, cSub), scheduler))
    cSub.add(this.signal.subscribe(new SignalObserver(observer, cSub), scheduler))
    return cSub
  }
}

export const takeUntil = curry(
  <T> (source: IObservable<T>, end: IObservable<any>) => new TakeUntil(source, end)
) as
  {<T> (source: IObservable<T>, end: IObservable<any>): IObservable<T>} &
  {<T> (source: IObservable<T>): {(end: IObservable<any>): IObservable<T>}}
