/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IPredicate} from '../types/IPredicate'
import {IScheduler} from '../types/IScheduler'
import {Curry2} from '../lib/Curry'


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

export const filter = Curry2(function (predicate: IPredicate<any>, source: IObservable<any>) {
  return new FilterObservable(predicate, source)
})
