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
import {DEFAULT_OPTIONS} from './TestOptions'

// TODO: convert to interface
export class TaskSchedule {
  constructor (public task: ITask, public time: number) {
  }
}

export class TaskSubscription implements Subscription {
  closed: boolean

  constructor (private queue: LinkedList<TaskSchedule>,
               private taskNode: LinkedListNode<TaskSchedule>) {
  }

  unsubscribe (): void {
    this.queue.remove(this.taskNode)
  }
}

export class TestScheduler implements Scheduler {
  private clock = 0
  readonly queue = new LinkedList<TaskSchedule>()

  constructor (private rafTimeout: number) {
  }

  tick () {
    this.clock++
    this.run()
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
    return new TaskSubscription(
      this.queue,
      this.queue.add(new TaskSchedule(task, time + now))
    )
  }

  requestAnimationFrame (task: ITask): Subscription {
    return this.setTimeout(task, this.now() + this.rafTimeout, 0)
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

  subscribeTo <T> (f: () => Observable<T>, start: number, stop: number) {
    let subscription: Subscription
    const observer = this.Observer()
    this.setTimeout(() => subscription = f().subscribe(observer, this), start, 0)
    this.setTimeout(() => !subscription.closed && subscription.unsubscribe(), stop, 0)
    return observer
  }

  start<T> (f: () => Observable<T>, start = DEFAULT_OPTIONS.subscriptionStart, stop = DEFAULT_OPTIONS.subscriptionStop) {
    const resultsObserver = this.subscribeTo(f, start, stop)
    this.advanceBy(stop)
    return resultsObserver
  }

  Cold <T> (events: Array<IEvent>) {
    return ColdTestObservable(this, events) as TestObservable<T>
  }

  Hot <T> (events: Array<IEvent>) {
    return HotTestObservable(this, events) as TestObservable<T>
  }

  Observer <T> () {
    return new TestObserver<T>(this)
  }

  static of (rafTimeout = DEFAULT_OPTIONS.rafTimeout) {
    return new TestScheduler(rafTimeout)
  }
}
