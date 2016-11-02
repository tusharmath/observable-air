/**
 * Created by tushar.mathur on 09/10/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {Curry3} from '../lib/Curry'
import {ICurriedFunction3} from '../types/ICurriedFunction'

export type Reducer <T, V> = (current: T, memory: V) => V

export class ScanObserver<T, V> implements IObserver<T> {

  constructor (private reducer: Reducer<T, V>,
               private value: V,
               private sink: IObserver<V>) {
  }

  next (val: T): void {
    this.value = this.reducer(val, this.value)
    this.sink.next(this.value)
  }

  error (err: Error): void {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }

}

export class ScanObservable<T, V> implements IObservable<V> {
  constructor (private reducer: Reducer<T, V>, private value: V, private source: IObservable<T>) {

  }

  subscribe (observer: IObserver<V>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new ScanObserver<T, V>(this.reducer, this.value, observer), scheduler)
  }
}

export const scan = Curry3(function <T, V> (reducer: Reducer<T, V>, value: V, source: IObservable<T>) {
  return new ScanObservable(reducer, value, source)
}) as ICurriedFunction3<Reducer<any, any>, any, IObservable<any>, IObservable<any>>
