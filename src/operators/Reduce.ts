/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {IReducer} from '../types/IReducer';

class ReduceObserver<T> implements IObserver<T> {
  constructor (private reducer: IReducer<T>,
               private value: T,
               private sink: IObserver<T>) {
  }

  next (val: T): void {
    this.value = this.reducer(this.value, val)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.next(this.value)
    this.sink.complete()
  }

}

export class ReduceObservable <T> implements IObservable<T> {
  constructor (private reducer: IReducer<T>,
               private value: T,
               private source: IObservable<T>) {
  }

  subscribe (obr: IObserver<T>): ISubscription {
    return this.source.subscribe(new ReduceObserver(this.reducer, this.value, obr))
  }
}

export function reduce <T> (reducer: IReducer<T>, value: T, source: IObservable<T>): IObservable<T> {
  return new ReduceObservable(reducer, value, source)
}
