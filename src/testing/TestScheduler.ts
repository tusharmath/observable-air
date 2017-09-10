/**
 * Created by tushar.mathur on 02/10/16.
 */
import {LinkedList, LinkedListNode} from '../lib/LinkedList'
import {IObservable} from '../lib/Observable'
import {IScheduler} from '../lib/Scheduler'
import {ISubscription} from '../lib/Subscription'
import {ColdTestObservable} from './ColdTestObservable'
import {IObservableEvent} from './Events'
import {HotTestObservable} from './HotTestObservable'
import {fromMarble} from './Marble'
import {TestObservable} from './TestObservable'
import {TestObserver} from './TestObserver'
import {DEFAULT_OPTIONS} from './TestOptions'

// TODO: convert to interface
class TaskSchedule {
  constructor(public task: () => void, public time: number) {}
}

class TaskSubscription implements ISubscription {
  closed: boolean

  constructor(
    private queue: LinkedList<TaskSchedule>,
    private taskNode: LinkedListNode<TaskSchedule>
  ) {}

  unsubscribe(): void {
    this.queue.remove(this.taskNode)
  }
}

export type EventSource = Array<IObservableEvent>

function normalizeEvents(...ev: EventSource): EventSource
function normalizeEvents(ev: EventSource): EventSource
function normalizeEvents(events: string): EventSource
function normalizeEvents(events: any) {
  if (typeof events === 'string') return fromMarble(events)
  if (arguments.length > 1) return Array.from(arguments)
  return events
}

export class TestScheduler implements IScheduler {
  asap(task: () => void): ISubscription {
    return this.delay(task, 1)
  }

  private clock = 0
  private queue = new LinkedList<TaskSchedule>()

  constructor(private rafTimeout: number) {}

  get length() {
    return this.queue.length
  }

  tick() {
    this.clock++
    this.run()
  }

  advanceBy(time: number): void {
    while (time-- > 0) this.tick()
  }

  advanceTo(time: number): void {
    this.advanceBy(time - this.now())
  }

  now() {
    return this.clock
  }

  delay(
    task: () => void,
    time: number,
    now: number = this.now()
  ): ISubscription {
    return new TaskSubscription(
      this.queue,
      this.queue.add(new TaskSchedule(task, time + now))
    )
  }

  frame(task: () => void): ISubscription {
    return this.delay(task, this.now() + this.rafTimeout, 0)
  }

  periodic(task: () => void, interval: number): ISubscription {
    var closed = false
    const repeatedTask = () => {
      if (closed) return
      task()
      this.delay(repeatedTask, interval)
    }
    this.delay(repeatedTask, interval)
    return {
      closed,
      unsubscribe() {
        closed = true
      }
    }
  }

  private run() {
    this.queue.forEach(node => {
      const qItem = node.value
      if (qItem.time === this.clock) {
        qItem.task()
        this.queue.remove(node)
      }
    })
  }

  subscribeTo<T>(f: () => IObservable<T>, start: number, stop: number) {
    let subscription: ISubscription
    const observer = this.Observer()
    this.delay(() => (subscription = f().subscribe(observer, this)), start, 0)
    this.delay(
      () => !subscription.closed && subscription.unsubscribe(),
      stop,
      0
    )
    return observer
  }

  start<T>(
    f: () => IObservable<T>,
    start = DEFAULT_OPTIONS.subscriptionStart,
    stop = DEFAULT_OPTIONS.subscriptionStop
  ) {
    const resultsObserver = this.subscribeTo(f, start, stop)
    this.advanceBy(stop)
    return resultsObserver
  }

  startSubscription (
    f: () => ISubscription,
    start = DEFAULT_OPTIONS.subscriptionStart,
    stop = DEFAULT_OPTIONS.subscriptionStop
  )  {
    let subscription: ISubscription
    this.delay(() => (subscription = f()), start)
    this.delay(() => subscription.unsubscribe(), stop)
    this.advanceBy(stop)
  }

  Cold<T>(events: string): TestObservable<T>
  Cold<T>(events: EventSource): TestObservable<T>
  Cold<T>(...events: EventSource): TestObservable<T>
  Cold<T>(...t: any[]) {
    return ColdTestObservable(this, normalizeEvents(...t)) as TestObservable<T>
  }

  Hot<T>(events: string): TestObservable<T>
  Hot<T>(...events: EventSource): TestObservable<T>
  Hot<T>(events: EventSource): TestObservable<T>
  Hot<T>(...t: any[]) {
    return HotTestObservable(this, normalizeEvents(...t)) as TestObservable<T>
  }

  Observer<T>() {
    return new TestObserver<T>(this)
  }

  static of(rafTimeout = DEFAULT_OPTIONS.rafTimeout) {
    return new TestScheduler(rafTimeout)
  }
}
