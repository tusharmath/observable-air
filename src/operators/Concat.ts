/**
 * Created by tushar on 05/09/17.
 */
import {ErrorMixin, NextMixin, Virgin} from '../internal/Mixins'
import {curry} from '../internal/Utils'
import {CompositeSubscription} from '../subscriptions/Subscription'

class ConcatObserver<T> extends ErrorMixin(NextMixin(Virgin))
  implements IObserver<T> {
  constructor(
    private src: IObservable<T>,
    readonly sink: IObserver<T>,
    private sh: IScheduler,
    private cSub: CompositeSubscription
  ) {
    super()
  }

  complete(): void {
    this.cSub.add(this.src.subscribe(this.sink, this.sh))
  }
}

class ConcatObservable<T> implements IObservable<T> {
  constructor(private src0: IObservable<T>, private src1: IObservable<T>) {}
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    cSub.add(
      this.src0.subscribe(
        new ConcatObserver(this.src1, observer, scheduler, cSub),
        scheduler
      )
    )
    return cSub
  }
}

export type ConcatType = {
  <T>(s0: IObservable<T>, s1: IObservable<T>): IObservable<T>
  <T>(s0: IObservable<T>): {(s1: IObservable<T>): IObservable<T>}
}

export const concat = curry(
  <T>(s0: IObservable<T>, s1: IObservable<T>) => new ConcatObservable(s0, s1)
) as ConcatType
