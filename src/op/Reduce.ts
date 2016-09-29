/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {IReducer} from '../types/IReducer';

class ReduceObserver<T> implements IObserver<T> {
  constructor (private r: IReducer<T>,
               private v: T,
               private obr: IObserver<T>) {
  }

  next (val: T): void {
    var r = this.r;
    this.v = r(this.v, val)
  }

  error (err: Error): void {
    this.obr.error(err)
  }

  complete (): void {
    this.obr.next(this.v)
    this.obr.complete()
  }

}

export class ReduceObservable <T> implements IObservable<T> {
  constructor (private r: IReducer<T>,
               private v: T,
               private src: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>): ISubscription {
    return this.src.subscribe(new ReduceObserver(this.r, this.v, observer))
  }
}

export function reduce <T> (reducer: IReducer<T>, value: T, source: IObservable<T>): IObservable<T> {
  return new ReduceObservable(reducer, value, source)
}
