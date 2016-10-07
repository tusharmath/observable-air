/**
 * Created by tushar.mathur on 06/10/16.
 */


import {ISubscription} from './core-types/ISubscription';
import {ISubscriberFunction} from './core-types/ISubscriberFunction';
import {IObserver} from './core-types/IObserver';
import {IScheduler} from './types/IScheduler';
import {ISubscriptionObserver} from './core-types/ISubscriptionObserver';

export class Subscription<T> implements ISubscription {
  closed: boolean;
  private disposable: ISubscription;
  private hostSubscription: ISubscription;

  constructor (private func: ISubscriberFunction<T>,
               private observer: IObserver<T>,
               private scheduler: IScheduler) {
    this.closed = true
  }

  unsubscribe (): void {
    this.disposable.unsubscribe()
    this.hostSubscription.unsubscribe()
    this.closed = true
  }

  run (): ISubscription {
    this.disposable = this.scheduler.scheduleASAP(() => this.execute())
    return this
  }

  execute () {
    this.hostSubscription = this.func(this.observer as ISubscriptionObserver<T>)
  }
}
