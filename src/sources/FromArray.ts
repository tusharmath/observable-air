/**
 * Created by tushar.mathur on 28/09/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'
import {tryCatch} from '../lib/Utils'

class FromArraySubscription<T> implements ISubscription {
  private subscription: ISubscription
  closed = false

  constructor(
    private array: Array<T>,
    private sink: IObserver<T>,
    scheduler: IScheduler
  ) {
    this.subscription = scheduler.asap(this.executeSafely.bind(this))
  }

  private executeSafely() {
    const r = tryCatch(this.execute).call(this)
    if (r.isError()) this.sink.error(r.getError())
  }

  execute() {
    const l = this.array.length
    const sink = this.sink
    for (var i = 0; i < l && !this.closed; ++i) {
      sink.next(this.array[i])
    }
    sink.complete()
  }

  unsubscribe(): void {
    this.subscription.unsubscribe()
    this.closed = true
  }
}

class FromObservable<T> implements IObservable<T> {
  constructor(private array: Array<T>) {}

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return new FromArraySubscription<T>(this.array, observer, scheduler)
  }
}

export function fromArray<T>(list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}

export const of = <T>(...t: Array<T>): IObservable<T> => new FromObservable(t)
