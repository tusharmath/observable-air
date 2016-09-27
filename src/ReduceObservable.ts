/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from './types/IObservable';
import {IObserver} from './types/IObserver';
import {ISubscription} from './types/ISubscription';
import {Observer} from './Observer';

export class ReduceObservable implements IObservable {
  private __source: IObservable
  private __reducer: Function
  private __value: any;

  constructor (reducer: Function, value: any, source: IObservable) {
    this.__source = source
    this.__reducer = reducer
    this.__value = value
  }

  subscribe (observer: IObserver): ISubscription {
    return this.__source.subscribe(Observer.of({
      next: (val) => {
        this.__value = this.__reducer(this.__value, val)
      },
      error: (err) => observer.error(err),
      complete: () => {
        observer.next(this.__value)
        observer.complete()
      }
    }))
  }
}
