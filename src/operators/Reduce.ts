/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Curry3} from '../lib/Curry'
import {ICurriedFunction3} from '../types/ICurriedFunction'

class ReduceObserver<T> implements IObserver<T> {
  constructor (private reducer: {(current: T, memory: T): T},
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
  constructor (private reducer: {(current: T, memory: T): T},
               private value: T,
               private source: IObservable<T>) {
  }

  subscribe (obr: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ReduceObserver(this.reducer, this.value, obr), scheduler)
  }
}

export const reduce = Curry3(function (reducer: {(current: any, memory: any): any}, value: any, source: IObservable<any>) {
  return new ReduceObservable(reducer, value, source)
}) as ICurriedFunction3<{(current: any, memory: any): any}, any, IObservable<any>, IObservable<any>>
