/**
 * Created by tushar.mathur on 27/09/16.
 */


import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Subscription} from '../types/core/Subscription'
import {Scheduler} from '../types/Scheduler'
import {Curry} from '../lib/Curry'

export type TPredicate<T> = {(value: T): boolean}
export type TSource<T> = Observable<T>
export type TResult<T> = Observable<T>

class FilterObserver <T> implements Observer<T> {
  constructor (private predicate: {(t: T): boolean}, private sink: Observer<T>) {
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


class FilterObservable <T> implements TResult<T> {
  constructor (private predicate: {(t: T): boolean},
               private source: Observable<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return this.source.subscribe(new FilterObserver(this.predicate, observer), scheduler)
  }
}

export const filter = Curry(function<T> (predicate: TPredicate<T>, source: TSource<T>) {
  return new FilterObservable(predicate, source)
}) as Function &
  {<T> (predicate: TPredicate<T>, source: TSource<T>): TResult<T>} &
  {<T> (predicate: TPredicate<T>): {(source: TSource<T>): TResult<T>}}
