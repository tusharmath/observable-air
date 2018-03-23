/**
 * Created by tushar.mathur on 03/10/16.
 */
import {IScheduler} from '../schedulers/Scheduler'
import {EVENT, IObservableEvent} from './Events'
import {toMarble} from './Marble'
import {IObserver} from './Observer'

export class TestObserver<T> implements IObserver<T> {
  results: Array<IObservableEvent>

  toString() {
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
