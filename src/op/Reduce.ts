/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {Observer} from '../Observer';
import {IReducer} from '../types/IReducer';

export class ReduceObservable <T> implements IObservable {
  constructor (private reducer: IReducer<T>,
               private value: T,
               private source: IObservable) {

  }

  subscribe (observer: IObserver): ISubscription {
    return this.source.subscribe(Observer.of(
      (val) => {
        this.value = this.reducer(this.value, val)
      },
      (err) => observer.error(err),
      () => {
        observer.next(this.value)
        observer.complete()
      }
    ))
  }
}

export function reduce <T> (reducer: IReducer<T>, value: T, source: IObservable): IObservable {
  return new ReduceObservable(reducer, value, source)
}
