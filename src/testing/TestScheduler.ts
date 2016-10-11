/**
 * Created by tushar.mathur on 02/10/16.
 */

import {ITask} from '../types/ITask';
import {IScheduler} from '../types/IScheduler';
import {IObservable} from '../types/core/IObservable';
import {ISubscription} from '../types/core/ISubscription';
import {IEvent} from '../types/IEvent';
import {TestObserver} from './TestObserver';
import {ColdTestObservable} from './ColdTestObservable';
import {HotTestObservable} from './HotTestObservable';

class TaskSchedule {
  constructor (public task: ITask, public time: number) {
  }
}
const MockDisposable = {unsubscribe: (): void => void 0, closed: false}

export class TestScheduler implements IScheduler {
  private clock: number;
  private queue: Array<TaskSchedule>;

  constructor () {
    this.clock = 0
    this.queue = []
  }

  tick () {
    this.clock++
    this.run()
  }

  advanceBy (time: number): void {
    while (time--) this.tick()
  }

  now () {
    return this.clock
  }

  setTimeout (task: ITask, relativeTime: number): ISubscription {
    this.queue.push(new TaskSchedule(task, relativeTime + this.now()))
    return MockDisposable
  }

  setAt (task: ITask, absoluteTime: number): ISubscription {
    this.queue.push(new TaskSchedule(task, absoluteTime))
    return MockDisposable
  }

  setImmediate (task: ITask): ISubscription {
    return this.setAt(task, this.now() + 1)
  }

  requestAnimationFrame (task: ITask): ISubscription {
    return this.setAt(task, this.now() + 16)
  }

  setInterval (task: ITask, interval: number): ISubscription {
    const repeatedTask = () => {
      task()
      this.setTimeout(repeatedTask, interval)
    }
    this.setTimeout(repeatedTask, interval)
    return MockDisposable;
  }

  private run () {
    var residual: Array<TaskSchedule> = []
    for (var i = 0; i < this.queue.length; ++i) {
      var qItem = this.queue[i]
      if (qItem.time <= this.clock) {
        qItem.task()
      } else {
        residual.push(qItem)
      }
    }
    this.queue = residual
  }

  start<T> (f: () => IObservable<T>, start = 200, stop = 2000): TestObserver<T> {
    var subscription: ISubscription
    var resultsObserver = new TestObserver(this);
    this.setAt(() => subscription = f().subscribe(resultsObserver, this), start)
    this.setAt(() => subscription.unsubscribe(), stop)

    this.run()
    this.advanceBy(stop)
    return resultsObserver
  }

  Cold <T> (events: Array<IEvent>) {
    return ColdTestObservable(this, events)
  }

  Hot <T> (events: Array<IEvent>) {
    return HotTestObservable(this, events)
  }

  static of () {
    return new TestScheduler()
  }
}
