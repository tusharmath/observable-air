/**
 * Created by tushar on 14/09/17.
 */

import {CompleteMixin, ErrorMixin, Virgin} from '../internal/Mixins'
import {curry} from '../internal/Utils'

class UniqueObserver<T> extends ErrorMixin(CompleteMixin(Virgin))
  implements IObserver<T> {
  constructor(private set: Set<T>, readonly sink: IObserver<T>) {
    super()
  }
  next(val: T): void {
    if (this.set.has(val) === false) {
      this.set.add(val)
      this.sink.next(val)
    }
  }
}

class UniqueObservable<T> implements IObservable<T> {
  constructor(private set: Set<T>, private src: IObservable<T>) {}
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return this.src.subscribe(new UniqueObserver(this.set, observer), scheduler)
  }
}

export type UniqueWithType = {
  <T>(set: Set<T>, source: IObservable<T>): IObservable<T>
  <T>(set: Set<T>): {(source: IObservable<T>): IObservable<T>}
}

export const uniqueWith = curry(
  (set: Set<any>, source: IObservable<any>) => new UniqueObservable(set, source)
) as UniqueWithType

export const unique = <T>(source: IObservable<T>): IObservable<T> =>
  new UniqueObservable(new Set(), source)
