/**
 * Created by tushar.mathur on 03/10/16.
 */

import {ReactiveEvents} from './ReactiveEvents'
import {IScheduler} from '../types/IScheduler'
import {IEvent} from '../types/IEvent'
import {IObserver} from '../types/core/IObserver'
import {ISubscription} from '../types/core/ISubscription'

export class TestObserver<T> implements IObserver<T> {
  results: Array<IEvent>

  constructor (private scheduler: IScheduler) {
    this.results = []
  }

  next (val: T): void {
    this.results.push(ReactiveEvents.next(this.scheduler.now(), val))
  }

  error (err: Error): void {
    this.results.push(ReactiveEvents.error(this.scheduler.now(), err))
  }

  complete (): void {
    this.results.push(ReactiveEvents.complete(this.scheduler.now()))
  }
}
