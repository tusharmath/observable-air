/**
 * Created by tushar.mathur on 09/10/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {IReducer} from '../types/IReducer'

export class ScanObserver<T> implements IObserver<T> {

  constructor (private reducer: IReducer<T>,
               private value: T,
               private sink: IObserver<T>) {
  }

  next (val: T): void {
    const value = this.reducer(this.value, val)
    this.value = value
    this.sink.next(value)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }

}

export class ScanObservable<T> implements IObservable<T> {
  constructor (private reducer: IReducer<T>, private value: T, private source: IObservable<T>) {

  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ScanObserver(this.reducer, this.value, observer), scheduler)
  }
}

export function scan<T> (reducer: IReducer<T>, value: T, source: IObservable<T>) {
  return new ScanObservable(reducer, value, source)
}
