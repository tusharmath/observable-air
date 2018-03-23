/**
 * Created by tushar.mathur on 06/10/16.
 */
import {IScheduler} from '../schedulers/Scheduler'
import {EVENT, IObservableEvent} from './Events'
import {toMarble} from './Marble'
import {IObservable} from './Observable'
import {IObserver} from './Observer'
import {ISubscription} from './Subscription'

export class TestObservable<T> implements IObservable<T> {
  public readonly subscriptions: Array<IObservableEvent> = []

  constructor(private func: (observer: IObserver<T>) => ISubscription) {}

  toString() {
    return toMarble(this.subscriptions)
  }

  subscribe(observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    const subscription = this.func(observer)
    const connections = this.subscriptions
    connections.push(EVENT.start(scheduler.now(), subscription))
    return {
      unsubscribe() {
        if (subscription.closed) return
        subscription.unsubscribe()
        connections.push(EVENT.end(scheduler.now(), subscription))
      },
      get closed() {
        return subscription.closed
      }
    }
  }
}
