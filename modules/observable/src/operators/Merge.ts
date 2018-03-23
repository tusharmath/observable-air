/**
 * Created by tushar.mathur on 17/10/16.
 */
import {ErrorMixin, NextMixin, Virgin} from '../internal/Mixins'
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {CompositeSubscription, ISubscription} from '../internal/Subscription'
import {IScheduler} from '../schedulers/Scheduler'

class MergeObserver<T> extends ErrorMixin(NextMixin(Virgin))
  implements IObserver<T> {
  private count = 0

  constructor(private total: number, public sink: IObserver<T>) {
    super()
  }

  complete(): void {
    this.count++
    if (this.count === this.total) {
      this.sink.complete()
    }
  }
}

class MergeObservable<T> implements IObservable<T> {
  constructor(private sources: Array<IObservable<T>>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const mergeObserver = new MergeObserver(this.sources.length, observer)
    for (var i = 0; i < this.sources.length; ++i) {
      cSub.add(this.sources[i].subscribe(mergeObserver, scheduler))
    }
    return cSub
  }
}

export function merge<T>(...sources: Array<IObservable<T>>): IObservable<T> {
  return new MergeObservable(sources)
}
