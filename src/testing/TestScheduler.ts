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
import {TestObservable} from './TestObservable'
import {resolveOptions, OptionType} from './TestOptions'

export class TaskSchedule {
  constructor (public task: ITask, public time: number) {
  }
}

export class TaskSubscription implements Subscription {
  closed: boolean

  constructor (private queue: LinkedList<TaskSchedule>, private taskNode: LinkedListNode<TaskSchedule>) {
  }

  unsubscribe (): void {
    this.queue.remove(this.taskNode)
  }
}

export class TestScheduler implements Scheduler {
  private clock = 0
  readonly queue = new LinkedList<TaskSchedule>()

  constructor (private options: OptionType) {
  }

  tick () {
    this.run()
    this.clock++
  }

  advanceBy (time: number): void {
    while (time-- > 0) this.tick()
  }

  advanceTo (time: number): void {
    this.advanceBy(time - this.now())
  }

  now () {
    return this.clock
  }

  setTimeout (task: ITask, time: number, now: number = this.now()): Subscription {
    return new TaskSubscription(this.queue, this.queue.add(new TaskSchedule(task, time + now)))
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

  subscribeTo <T> (f: () => Observable<T>) {
    let subscription: Subscription
    const resultsObserver = new TestObserver(this)
    this.setTimeout(() => subscription = f().subscribe(resultsObserver, this), resolveOptions(this.options).start, 0)
    this.setTimeout(() => !subscription.closed && subscription.unsubscribe(), resolveOptions(this.options).stop, 0)
    return resultsObserver
  }

  start<T> (f: () => Observable<T>) {
    const resultsObserver = this.subscribeTo(f)
    this.advanceBy(this.options.stop)
    return resultsObserver
  }

  Cold <T> (events: Array<IEvent>) {
    return ColdTestObservable(this, events) as TestObservable<T>
  }

  Hot <T> (events: Array<IEvent>) {
    return HotTestObservable(this, events) as TestObservable<T>
  }

  static of (options: {start?: number, stop?: number, rafTimeout?: number} = {}) {
    return new TestScheduler(resolveOptions(options))
  }
}
