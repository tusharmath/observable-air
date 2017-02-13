/**
 * Created by tushar.mathur on 03/10/16.
 */
import {EVENT, ObservableEvent} from './Events'
import {Scheduler} from '../lib/Scheduler'
import {Observer} from '../types/core/Observer'

export class TestObserver<T> implements Observer<T> {
  results: Array<ObservableEvent>

  constructor (private scheduler: Scheduler) {
    this.results = []
  }

  next (val: T): void {
    this.results.push(EVENT.next(this.scheduler.now(), val))
  }

  error (err: Error): void {
    this.results.push(EVENT.error(this.scheduler.now(), err))
  }

  complete (): void {
    this.results.push(EVENT.complete(this.scheduler.now()))
  }
}
