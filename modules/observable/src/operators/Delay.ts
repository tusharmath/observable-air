import {ErrorMixin, Virgin} from '../internal/Mixins'
/**
 * Created by tushar on 29/01/17.
 */
import {IObservable} from '../internal/Observable'
import {IObserver} from '../internal/Observer'
import {safeObserver} from '../internal/SafeObserver'
import {CompositeSubscription, ISubscription} from '../internal/Subscription'
import {curry} from '../internal/Utils'
import {IScheduler} from '../schedulers/Scheduler'

class DelayObserver<T> extends ErrorMixin(Virgin) implements IObserver<T> {
  constructor(
    private timeout: number,
    public sink: IObserver<T>,
    private scheduler: IScheduler,
    private cSub: CompositeSubscription
  ) {
    super()
  }

  next(val: T): void {
    const node = this.cSub.add(
      this.scheduler.delay(() => {
        this.sink.next(val)
        this.cSub.remove(node)
      }, this.timeout)
    )
  }

  complete(): void {
    this.cSub.add(
      this.scheduler.delay(this.sink.complete.bind(this.sink), this.timeout)
    )
  }
}

class DelayObservable<T> implements IObservable<T> {
  constructor(private timeout: number, private source: IObservable<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    const delayObserver = new DelayObserver(
      this.timeout,
      safeObserver(observer),
      scheduler,
      cSub
    )
    cSub.add(this.source.subscribe(delayObserver, scheduler))
    return cSub
  }
}

export const delay = curry(
  <T>(timeout: number, source: IObservable<T>): IObservable<T> =>
    new DelayObservable(timeout, source)
) as {<T>(timeout: number, source: IObservable<T>): IObservable<T>} & {
  <T>(timeout: number): {(source: IObservable<T>): IObservable<T>}
}
