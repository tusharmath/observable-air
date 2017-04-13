/**
 * Created by tushar.mathur on 06/10/16.
 */
import {IObservable} from '../lib/Observable'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'
import {EVENT, IObservableEvent} from './Events'


export class TestObservable<T> implements IObservable<T> {
  subscriptions: Array<IObservableEvent> = []

  constructor (private func: (observer: IObserver<T>) => ISubscription) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const subscription = this.func(observer)
    const connections = this.subscriptions
    connections.push(EVENT.start(scheduler.now(), subscription))
    return {
      unsubscribe() {
        subscription.unsubscribe()
        connections.push(EVENT.end(scheduler.now(), subscription))
      },
      get closed () {
        return subscription.closed
      }
    }
  }
}
