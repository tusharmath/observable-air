/**
 * Created by tushar.mathur on 28/09/16.
 */

import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ILazySubscription} from '../types/ILazySubscription'
import {SafeExecutor} from '../lib/SafeExecutor'

class FromRunner <T> implements ILazySubscription {
  closed: boolean
  private schedule: ISubscription

  constructor (private array: Array<T>, private sink: IObserver<T>, private scheduler: IScheduler) {
    this.closed = false
  }

  run () {
    this.schedule = this.scheduler.setTimeout(() => this.executeSafely(), 1)
    return this
  }

  executeSafely () {
    const r = SafeExecutor(() => this.execute())
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
    this.schedule.unsubscribe()
    this.closed = true
  }
}

export class FromObservable<T> implements IObservable<T> {
  constructor (private array: Array<T>) {
  }

  subscribe (observer: IObserver<T>, scheduler: IScheduler): ISubscription {

    return new FromRunner<T>(this.array, observer, scheduler).run()
  }
}

export function fromArray<T> (list: Array<T>): IObservable<T> {
  return new FromObservable(list)
}
