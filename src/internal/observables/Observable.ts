/**
 * Created by tushar.mathur on 27/09/16.
 */
import {
  CompositeSubscription,
  Subscription
} from '../../subscriptions/Subscription'

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
