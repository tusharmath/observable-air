/**
 * Created by tushar.mathur on 27/09/16.
 */

import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'

export type TPredicate<T> = {(value: T): boolean}
export type TSource<T> = IObservable<T>
export type TResult<T> = IObservable<T>

class FilterObserver<T> implements IObserver<T> {
  constructor(private predicate: {(t: T): boolean}, private sink: IObserver<T>) {}

  next(val: T) {
    if (this.predicate(val)) this.sink.next(val)
  }

  error(err: Error) {
    this.sink.error(err)
  }

  complete(): void {
    this.sink.complete()
  }
}

class FilterObservable<T> implements TResult<T> {
  constructor(private predicate: {(t: T): boolean}, private source: IObservable<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(new FilterObserver(this.predicate, observer), scheduler)
  }
}

export const filter = curry(function<T>(predicate: TPredicate<T>, source: TSource<T>) {
  return new FilterObservable(predicate, source)
}) as Function & {<T>(predicate: TPredicate<T>, source: TSource<T>): TResult<T>} & {
    <T>(predicate: TPredicate<T>): {(source: TSource<T>): TResult<T>};
  }
