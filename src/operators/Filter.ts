/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {IPredicate} from '../types/IPredicate';
import {IScheduler} from '../types/IScheduler';


class FilterObserver <T> implements IObserver<T> {
  constructor (private predicate: IPredicate<T>, private sink: IObserver<T>) {
  }

  next (val: T) {
    if (this.predicate(val)) this.sink.next(val)
  }

  error (err: Error) {
    this.sink.error(err)
  }

  complete (): void {
    this.sink.complete()
  }
}


export class FilterObservable <T> implements IObservable<T> {
  constructor (private predicate: IPredicate<T>,
               private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new FilterObserver(this.predicate, observer), scheduler)
  }
}

export function filter<T> (predicate: IPredicate<T>, source: IObservable<T>): IObservable<T> {
  return new FilterObservable(predicate, source)
}
