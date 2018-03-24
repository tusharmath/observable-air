/**
 * Created by niranjan on 12/10/16.
 */
import {CompleteMixin, ErrorMixin, Virgin} from '../internal/Mixins'
import {curry} from '../internal/Utils'

export type TComparator<T> = (a: T, b: T) => boolean
export type TSource<T> = IObservable<T>
export type TResult<T> = IObservable<T>

class SkipRepeatsObserver<T> extends ErrorMixin(CompleteMixin(Virgin))
  implements IObserver<T> {
  private previous: T | void = undefined
  private init = true

  constructor(private cmp: {(a: T, b: T): boolean}, public sink: IObserver<T>) {
    super()
  }

  next(val: T) {
    if (this.init) {
      this.init = false
      this.sink.next(val)
      this.previous = val
    } else if (this.cmp(this.previous as T, val) === false) {
      this.sink.next(val)
      this.previous = val
    }
  }
}

class SkipRepeatsObservable<T> implements TResult<T> {
  constructor(private cmp: TComparator<T>, private source: TSource<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.source.subscribe(
      new SkipRepeatsObserver(this.cmp, observer),
      scheduler
    )
  }
}

export const skipRepeats = curry(function(
  hashFunction: TComparator<any>,
  source: IObservable<any>
) {
  return new SkipRepeatsObservable(hashFunction, source)
}) as {<T>(cmp: TComparator<T>, source: TSource<T>): TResult<T>} & {
  <T>(cmp: TComparator<T>): {(source: TSource<T>): TResult<T>}
}
