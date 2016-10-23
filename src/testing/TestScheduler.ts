/**
 * Created by tushar.mathur on 02/10/16.
 */

import {ITask} from '../types/ITask'
import {IScheduler} from '../types/IScheduler'
import {IObservable} from '../types/core/IObservable'
import {ISubscription} from '../types/core/ISubscription'
import {IEvent} from '../types/IEvent'
import {TestObserver} from './TestObserver'
import {ColdTestObservable} from './ColdTestObservable'
import {HotTestObservable} from './HotTestObservable'
import {LinkedList, LinkedListNode} from '../lib/LinkedList'

class TaskSchedule {
  constructor (public task: ITask, public time: number) {
  }
}

class TaskSubscription implements ISubscription {
  closed: boolean

  constructor (private queue: LinkedList<TaskSchedule>, private taskNode: LinkedListNode<TaskSchedule>) {
  }

  unsubscribe (): void {
    this.queue.remove(this.taskNode)
  }
}

export class TestScheduler implements IScheduler {
  private clock = 0
  private queue = new LinkedList<TaskSchedule>()

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

  setTimeout (task: ITask, time: number, now: number = this.now()): ISubscription {
    return new TaskSubscription(this.queue, this.queue.add(new TaskSchedule(task, time + now)))
  }

  setImmediate (task: ITask): ISubscription {
    return this.setTimeout(task, this.now() + 1, 0)
  }

  requestAnimationFrame (task: ITask): ISubscription {
    return this.setTimeout(task, this.now() + 16, 0)
  }

  setInterval (task: ITask, interval: number): ISubscription {
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

  start<T> (f: () => IObservable<T>, start = 200, stop = 2000): TestObserver<T> {
    var subscription: ISubscription
    const resultsObserver = new TestObserver(this)
    this.setTimeout(() => subscription = f().subscribe(resultsObserver, this), start, 0)
    this.setTimeout(() => !subscription.closed && subscription.unsubscribe(), stop, 0)
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
