/**
 * Created by tushar.mathur on 06/10/16.
 */
import {Observable} from '../types/core/IObservable'
import {Observer} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {Subscription} from '../types/core/ISubscription'
import {IEvent} from '../types/IEvent'
import {ReactiveEvents} from './ReactiveEvents'


export class TestObservable<T> implements Observable<T> {
  subscriptions: Array<IEvent> = []

  constructor (private func: (observer: Observer<T>) => Subscription) {
  }

  subscribe (observer: Observer<T>, scheduler: IScheduler): Subscription {
    const subscription = this.func(observer)
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
