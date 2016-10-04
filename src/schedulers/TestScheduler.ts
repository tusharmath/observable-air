/**
 * Created by tushar.mathur on 02/10/16.
 */

import {IDisposable} from '../types/IDisposable';
import {ITask} from '../types/ITask';
import {IScheduler} from '../types/IScheduler';
import {IObservable} from '../types/IObservable';
import {IObserver} from '../types/IObserver';
import {ISubscription} from '../types/ISubscription';
import {EventNext} from '../testing/ReactiveTest';
import {Observable} from '../Observable';
import {IEvent} from '../types/IEvent';
import {TestObserver} from '../lib/TestObserver';

class TaskSchedule {
  constructor (public task: ITask, public time: number) {
  }
}
const MockDisposable = {dispose: (): void => void 0, disposed: false}

export const DEFAULT_TIMING = {
  start: 200,
  stop: 2000
}

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

  schedule (task: ITask, relativeTime: number): IDisposable {
    this.queue.push(new TaskSchedule(task, relativeTime + this.now()))
    return MockDisposable
  }

  scheduleAbsolute (task: ITask, absoluteTime: number): IDisposable {
    this.queue.push(new TaskSchedule(task, absoluteTime))
    return MockDisposable
  }

  scheduleASAP (task: ITask): IDisposable {
    return this.scheduleAbsolute(task, this.now() + 1)
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

  startScheduler<T> (f: () => IObservable<T>,
                     timing: {start: number, stop: number} = DEFAULT_TIMING): IObserver<T> {
    var subscription: ISubscription
    var resultsObserver = new TestObserver(this);
    this.scheduleAbsolute(() => subscription = f().subscribe(resultsObserver), timing.start)
    this.scheduleAbsolute(() => subscription.unsubscribe(), timing.stop)
    this.advanceBy(timing.stop)
    return resultsObserver
  }

  createColdObservable <T> (events: Array<IEvent>): IObservable<IEvent> {
    return Observable.of((observer: IObserver<any>) => {
      for (var i = 0; i < events.length; i++) {
        const event = events[i]
        if (event.type === 'next') {
          this.schedule(() => observer.next((<EventNext<any>> event).value), event.time)
        }
        else if (event.type === 'complete') {
          this.schedule(() => observer.complete(), event.time)
        }
      }
      return {
        unsubscribe () {

        },
        closed: false
      }
    })
  }

  static of () {
    return new TestScheduler()
  }
}
