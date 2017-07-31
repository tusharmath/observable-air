/**
 * Created by tushar on 29/01/17.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {safeObserver} from '../lib/SafeObserver'
import {IScheduler} from '../lib/Scheduler'
import {CompositeSubscription, ISubscription} from '../lib/Subscription'
import {curry} from '../lib/Utils'

class DelayObserver<T> implements IObserver<T> {
  constructor(
    private timeout: number,
    private sink: IObserver<T>,
    private scheduler: IScheduler,
    private cSub: CompositeSubscription
  ) {}

  next(val: T): void {
    const node = this.cSub.add(
      this.scheduler.delay(() => {
        this.sink.next(val)
        this.cSub.remove(node)
      }, this.timeout)
    )
  }

  error(err: Error): void {
    this.sink.error(err)
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
