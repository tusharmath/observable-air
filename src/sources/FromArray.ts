/**
 * Created by tushar.mathur on 28/09/16.
 */
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {Observer} from '../types/core/Observer'
import {Scheduler} from '../types/Scheduler'
import {toSafeFunction} from '../lib/ToSafeFunction'

class FromArraySubscription <T> implements Subscription {
  private subscription: Subscription
  closed = false

  constructor (private array: Array<T>, private sink: Observer<T>, scheduler: Scheduler) {
    this.subscription = scheduler.setTimeout(this.executeSafely.bind(this), 1)
  }


  private executeSafely () {
    const r = toSafeFunction(this.execute).call(this)
    if (r.hasError()) this.sink.error(r.error)
  }

  execute () {
    const l = this.array.length
    const sink = this.sink
    for (var i = 0; i < l && !this.closed; ++i) {
      sink.next(this.array[i])
    }
    sink.complete()
  }

  unsubscribe (): void {
    this.subscription.unsubscribe()
    this.closed = true
  }
}

class FromObservable<T> implements Observable<T> {
  constructor (private array: Array<T>) {
  }

  subscribe (observer: Observer<T>, scheduler: Scheduler): Subscription {
    return new FromArraySubscription<T>(this.array, observer, scheduler)
  }
}

export function fromArray<T> (list: Array<T>): Observable<T> {
  return new FromObservable(list)
}

export function of<T> (...list: Array<T>) {
  return fromArray(list)
}
