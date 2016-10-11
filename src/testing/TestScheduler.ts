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
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';
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

  schedule (task: ITask, relativeTime: number): ISubscription {
    this.queue.push(new TaskSchedule(task, relativeTime + this.now()))
    return MockDisposable
  }

  scheduleAbsolute (task: ITask, absoluteTime: number): ISubscription {
    this.queue.push(new TaskSchedule(task, absoluteTime))
    return MockDisposable
  }

  scheduleASAP (task: ITask): ISubscription {
    return this.scheduleAbsolute(task, this.now() + 1)
  }

  scheduleNow (task: ITask): ISubscription {
    return this.scheduleAbsolute(task, this.now())
  }

  scheduleUsing (strategy: ISchedulingStrategy, task: ITask) {
    return strategy.run(task)
  }

  scheduleRepeatedly (task: ITask, interval: number): ISubscription {
    const repeatedTask = () => {
      task()
      this.schedule(repeatedTask, interval)
    }
    this.schedule(repeatedTask, interval)
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
    this.scheduleAbsolute(() => subscription = f().subscribe(resultsObserver, this), start)
    this.scheduleAbsolute(() => subscription.unsubscribe(), stop)

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
