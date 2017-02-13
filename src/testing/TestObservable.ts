/**
 * Created by tushar.mathur on 06/10/16.
 */
import {Observable} from '../lib/Observable'
import {Observer} from '../lib/Observer'
import {Scheduler} from '../lib/Scheduler'
import {Subscription} from '../lib/Subscription'
import {EVENT, ObservableEvent} from './Events'


export class TestObservable<T> implements Observable<T> {
  subscriptions: Array<ObservableEvent> = []

  constructor (private func: (observer: Observer<T>) => Subscription) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
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
