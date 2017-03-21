/**
 * Created by tushar.mathur on 03/10/16.
 */
import {EVENT, IObservableEvent} from './Events'
import {IScheduler} from '../lib/Scheduler'
import {IObserver} from '../lib/Observer'

export class TestObserver<T> implements IObserver<T> {
  results: Array<IObservableEvent>

  constructor (private scheduler: IScheduler) {
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
