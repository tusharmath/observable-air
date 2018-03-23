/**
 * Created by tushar.mathur on 16/10/16.
 */
import {LinkedListNode} from 'linked-list'
import {ErrorMixin, NextMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {CompositeSubscription, ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'
import {map} from './Map'
import {IOperator} from './Operator'

class SwitchValueObserver<T> extends ErrorMixin(NextMixin(Virgin))
  implements IObserver<T> {
  constructor(public sink: IObserver<T>) {
    super()
  }

  complete(): void {}
}

class SwitchOperator<T> extends ErrorMixin(CompositeSubscription)
  implements IOperator<IObservable<T>> {
  public sink = new SwitchValueObserver(this.mainSink)
  private srcSub: LinkedListNode<ISubscription>

  constructor(
    private source: IObservable<IObservable<T>>,
    private mainSink: IObserver<T>,
    private scheduler: IScheduler
  ) {
    super()
    this.add(this.source.subscribe(this, scheduler))
  }

  next(val: IObservable<T>): void {
    this.remove(this.srcSub)
    this.srcSub = this.add(val.subscribe(this.sink, this.scheduler))
  }

  complete(): void {
    this.remove(this.srcSub)
    this.mainSink.complete()
  }
}

class SwitchLatest<T> implements IObservable<T> {
  constructor(private source: IObservable<IObservable<T>>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return new SwitchOperator(this.source, observer, scheduler)
  }
}

export function switchLatest<T>(
  source: IObservable<IObservable<T>>
): IObservable<T> {
  return new SwitchLatest(source)
}
export const switchMap = curry(
  <T, K>(fn: (t: K) => IObservable<T>, source: IObservable<K>) => {
    return switchLatest(map(fn, source))
  }
) as {
  <T, K>(mapper: (t: K) => IObservable<T>, source: IObservable<K>): IObservable<
    T
  >
} & {
  <T, K>(mapper: (t: K) => IObservable<T>): {
    (source: IObservable<K>): IObservable<T>
  }
}
