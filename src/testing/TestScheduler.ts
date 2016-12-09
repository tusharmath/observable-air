/**
 * Created by tushar.mathur on 02/10/16.
 */

import {ITask} from '../types/ITask'
import {Scheduler} from '../types/Scheduler'
import {Observable} from '../types/core/Observable'
import {Subscription} from '../types/core/Subscription'
import {IEvent} from '../types/IEvent'
import {TestObserver} from './TestObserver'
import {ColdTestObservable} from './ColdTestObservable'
import {HotTestObservable} from './HotTestObservable'
import {LinkedList, LinkedListNode} from '../lib/LinkedList'
import {ISchedulerOptions} from '../types/ISchedulerOptions'
import {TestObservable} from './TestObservable'

export const START_SUBSCRIPTION_TIME = 200
export const STOP_SUBSCRIPTION_TIME = 2000


class TaskSchedule {
  constructor (public task: ITask, public time: number) {
  }
}

class TaskSubscription implements Subscription {
  closed: boolean

  constructor (private queue: LinkedList<TaskSchedule>, private taskNode: LinkedListNode<TaskSchedule>) {
  }

  unsubscribe (): void {
    this.queue.remove(this.taskNode)
  }
}

export class TestScheduler implements Scheduler {
  private clock = 0
  private queue = new LinkedList<TaskSchedule>()

  constructor (private options: ISchedulerOptions) {
  }

  tick () {
    this.run()
    this.clock++
  }

  advanceBy (time: number): void {
    while (time-- > -1) this.tick()
  }

  now () {
    return this.clock
  }

  setTimeout (task: ITask, time: number, now: number = this.now()): Subscription {
    return new TaskSubscription(this.queue, this.queue.add(new TaskSchedule(task, time + now)))
  }

  setImmediate (task: ITask): Subscription {
    return this.setTimeout(task, this.now() + 1, 0)
  }

  requestAnimationFrame (task: ITask): Subscription {
    return this.setTimeout(task, this.now() + this.options.rafTimeout, 0)
  }

  setInterval (task: ITask, interval: number): Subscription {
    var closed = false
    const repeatedTask = () => {
      if (closed) return
      task()
      this.setTimeout(repeatedTask, interval)
    }
    this.setTimeout(repeatedTask, interval)
    return {
      closed,
      unsubscribe () {
        closed = true
      }
    }
  }

  private run () {
    this.queue.forEach(node => {
      const qItem = node.value
      if (qItem.time === this.clock) {
        qItem.task()
        this.queue.remove(node)
      }
    })
  }

  start<T> (f: () => Observable<T>,
            start = START_SUBSCRIPTION_TIME,
            stop = STOP_SUBSCRIPTION_TIME) {
    var subscription: Subscription
    const resultsObserver = new TestObserver(this)
    this.setTimeout(() => subscription = f().subscribe(resultsObserver, this), start, 0)
    this.setTimeout(() => !subscription.closed && subscription.unsubscribe(), stop, 0)
    this.advanceBy(stop)
    return resultsObserver
  }

  Cold <T> (events: Array<IEvent>) {
    return ColdTestObservable(this, events) as TestObservable<T>
  }

  Hot <T> (events: Array<IEvent>) {
    return HotTestObservable(this, events) as TestObservable<T>
  }

  static of (options: ISchedulerOptions = {rafTimeout: 16}) {
    return new TestScheduler(options)
  }
}
