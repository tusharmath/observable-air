/**
 * Created by tushar on 05/02/17.
 */
import {Observable} from '../types/core/Observable'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'

class OnlySubscription implements Subscription {
  closed = false

  unsubscribe (): void {
    this.closed = true
  }
}
class Only<T> implements Observable<T> {
  constructor (private value: T) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    observer.next(this.value)
    return new OnlySubscription()
  }
}

export const only = <T> (value: T): Observable<T> => new Only(value)
