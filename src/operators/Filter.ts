/**
 * Created by tushar.mathur on 27/09/16.
 */

import {CompleteMixin, ErrorMixin, Virgin} from '../internal/Mixins'
import {curry} from '../internal/Utils'

export type TPredicate<T> = {(value: T): boolean}
export type TSource<T> = IObservable<T>
export type TResult<T> = IObservable<T>

class FilterObserver<T> extends ErrorMixin(CompleteMixin(Virgin))
  implements IObserver<T> {
  constructor(private predicate: {(t: T): boolean}, public sink: IObserver<T>) {
    super()
  }

  next(val: T) {
    if (this.predicate(val)) this.sink.next(val)
  }
}

class FilterObservable<T> implements TResult<T> {
  constructor(
    private predicate: {(t: T): boolean},
    private source: IObservable<T>
  ) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(
      new FilterObserver(this.predicate, observer),
      scheduler
    )
  }
}

export const filter = curry(function<T>(
  predicate: TPredicate<T>,
  source: TSource<T>
) {
  return new FilterObservable(predicate, source)
}) as {<T>(predicate: TPredicate<T>, source: TSource<T>): TResult<T>} & {
  <T>(predicate: TPredicate<T>): {(source: TSource<T>): TResult<T>}
}
