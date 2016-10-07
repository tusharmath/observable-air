/**
 * Created by tushar.mathur on 03/10/16.
 */

import {ReactiveTest} from './ReactiveTest';
import {IScheduler} from '../types/IScheduler';
import {IEvent} from '../types/IEvent';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';

export class TestObserver<T> implements IObserver<T> {
  results: Array<IEvent>;

  constructor (private scheduler: IScheduler) {
    this.results = []
  }

  start (subscription: ISubscription): void {
    // this.results.push(ReactiveTest.start(this.scheduler.now(), subscription))
  }

  next (val: T): void {
    this.results.push(ReactiveTest.next(this.scheduler.now(), val))
  }

  error (err: Error): void {
    this.results.push(ReactiveTest.error(this.scheduler.now(), err))
  }

  complete (): void {
    this.results.push(ReactiveTest.complete(this.scheduler.now()))
  }
}
