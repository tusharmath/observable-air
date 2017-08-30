/**
 * Created by tushar.mathur on 27/09/16.
 */
import {IObservable} from './Observable'
import {IObserver} from './Observer'
import {IScheduler} from './Scheduler'
import {ISubscriberFunction} from './SubscriberFunction'
import {
  CompositeSubscription,
  ISubscription,
  Subscription
} from './Subscription'

export interface IObservable<T> {
  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription
}

export class Observable<T> implements IObservable<T> {
  constructor(private f: ISubscriberFunction<T>) {}

  run(
    cSub: CompositeSubscription,
    observer: IObserver<T>,
    scheduler: IScheduler
  ) {
    cSub.add(new Subscription(this.f(observer, scheduler)))
  }

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const cSub = new CompositeSubscription()
    cSub.add(scheduler.asap(this.run.bind(this, cSub, observer, scheduler)))
    return cSub
  }
}
