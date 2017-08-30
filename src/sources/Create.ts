/**
 * Created by tushar.mathur on 16/10/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'

class JustObservable<T> implements IObservable<T> {
  constructor(private val: T) {}

  run(observer: IObserver<T>) {
    observer.next(this.val)
    observer.complete()
  }

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return scheduler.asap(this.run.bind(this, observer))
  }
}

const MockSubscription: ISubscription = {
  unsubscribe() {},
  closed: false
}

class Never implements IObservable<void> {
  subscribe(observer: IObserver<void>, scheduler: IScheduler): ISubscription {
    return MockSubscription
  }
}

class Empty implements IObservable<void> {
  subscribe(observer: IObserver<void>, scheduler: IScheduler): ISubscription {
    return scheduler.asap(observer.complete.bind(observer))
  }
}

export const empty = (): IObservable<void> => new Empty()
export const just = <T>(value: T): IObservable<T> => new JustObservable(value)
export const never = (): IObservable<void> => new Never()
