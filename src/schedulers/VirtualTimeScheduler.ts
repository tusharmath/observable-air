/**
 * Created by tushar.mathur on 02/10/16.
 */

import {IDisposable} from '../types/IDisposable';
import {ITask} from '../types/ITask';
import {IScheduler} from '../types/IScheduler';
import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {ReactiveTest} from '../lib/ReactiveTest';

class TaskSchedule {
  constructor (public task: ITask, public time: number) {
  }
}
const MockDisposable = {dispose: (): void => void 0, disposed: false}


function createSubscription (results: Array<any>, scheduler: IScheduler): IObserver<any> {
  return {
    next: (value: any) => results.push(ReactiveTest.next(scheduler.now(), value)),
    error: (value: Error) => results.push(ReactiveTest.error(scheduler.now(), value)),
    complete: () => results.push(ReactiveTest.complete(scheduler.now()))
  };
}

export class VirtualTimeScheduler implements IScheduler {
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

  schedule (task: ITask, relativeTime: number): IDisposable {
    this.queue.push(new TaskSchedule(task, relativeTime + this.now()))
    return MockDisposable
  }

  scheduleAbsolute (task: ITask, absoluteTime: number): IDisposable {
    this.queue.push(new TaskSchedule(task, absoluteTime))
    return MockDisposable
  }

  private run () {
    var residual: Array<TaskSchedule> = []
    for (var i = 0; i < this.queue.length; ++i) {
      var qItem = this.queue[i]
      if (qItem.time <= this.clock) {
        qItem.task.run()
      } else {
        residual.push(qItem)
      }
    }
    this.queue = residual
  }

  startScheduler<T> (
    f: () => IObservable<T>,
    timing: {start: number, stop: number} = {start: 200, stop: 2000}
  ) {
    var results: Array<any> = []
    var subscription: ISubscription
    this.scheduleAbsolute({run: () => subscription = f().subscribe(createSubscription(results, this))}, timing.start)
    this.scheduleAbsolute({run: () => subscription.unsubscribe()}, timing.stop)
    this.advanceBy(timing.stop)
    return {results}
  }

  static of () {
    return new VirtualTimeScheduler()
  }
}
