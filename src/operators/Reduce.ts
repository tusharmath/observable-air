/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IReducer} from '../types/IReducer'
import {IScheduler} from '../types/IScheduler'
import {Curry3} from '../lib/Curry'

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

  subscribe (obr: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ReduceObserver(this.reducer, this.value, obr), scheduler)
  }
}

export const reduce = Curry3(function (reducer: IReducer<any>, value: any, source: IObservable<any>) {
  return new ReduceObservable(reducer, value, source)
})
