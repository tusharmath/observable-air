/**
 * Created by tushar.mathur on 06/10/16.
 */

import {IObservable} from '../types/core/IObservable';
import {IObserver} from '../types/core/IObserver';
import {IScheduler} from '../types/IScheduler';
import {ISubscription} from '../types/core/ISubscription';
import {ISubscriberFunction} from '../types/core/ISubscriberFunction';
import {Subscription} from './Subscription';
import {IEvent} from '../types/IEvent';
import {ReactiveEvents} from './ReactiveEvents';


export class TestObservable<T> implements IObservable<T> {
  subscriptions: Array<IEvent> = [];

  constructor (private func: ISubscriberFunction<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const subscription = Subscription.from(this.func(observer))
    const connections = this.subscriptions
    connections.push(ReactiveEvents.start(scheduler.now(), subscription))
    return {
      unsubscribe() {
        subscription.unsubscribe()
        connections.push(ReactiveEvents.end(scheduler.now(), subscription))
      },
      get closed () {
        return subscription.closed
      }
    }
  }
}
