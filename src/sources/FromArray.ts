/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {toSafeFunction} from '../lib/TryCatch'

class FromArraySubscription <T> implements ISubscription {
  private subscription: ISubscription
  closed = false

  constructor (private array: Array<T>, private sink: IObserver<T>, private scheduler: IScheduler) {
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

export class FromObservable<T> implements IObservable<T> {
  constructor (private array: Array<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {
    return new FromArraySubscription<T>(this.array, observer, scheduler)
  }
}

export function fromArray<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
