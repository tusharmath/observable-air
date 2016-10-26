/**
 * Created by tushar.mathur on 27/09/16.
 */


import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'
import {IScheduler} from '../types/IScheduler'
import {Curry2} from '../lib/Curry'
import {ICurriedFunction2} from '../types/ICurriedFunction'


class FilterObserver <T> implements IObserver<T> {
  constructor (private predicate: {(t: T): boolean}, private sink: IObserver<T>) {
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
  constructor (private predicate: {(t: T): boolean},
               private source: IObservable<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new FilterObserver(this.predicate, observer), scheduler)
  }
}

export const filter = Curry2(function (predicate: {(t: any): boolean}, source: IObservable<any>) {
  return new FilterObservable(predicate, source)
}) as ICurriedFunction2<{(t: any): boolean}, IObservable<any>, IObservable<any>>
