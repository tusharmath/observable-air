/**
 * Created by tushar.mathur on 03/10/16.
 */
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'
import {EVENT, IObservableEvent} from './Events'
import {toMarble} from './Marble'

export class TestObserver<T> implements IObserver<T> {
  results: Array<IObservableEvent>

  get marble() {
    return toMarble(this.results)
  }

  constructor(private scheduler: IScheduler) {
    this.results = []
  }

  next(val: T): void {
    this.results.push(EVENT.next(this.scheduler.now(), val))
  }

  error(err: Error): void {
    this.results.push(EVENT.error(this.scheduler.now(), err))
  }

  complete(): void {
    this.results.push(EVENT.complete(this.scheduler.now()))
  }
}
