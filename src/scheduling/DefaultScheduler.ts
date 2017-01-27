/**
 * Created by tushar.mathur on 03/10/16.
 */
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {ITask} from '../types/ITask'
import {IScheduledTask} from '../types/IScheduledTask'

function run (task: IScheduledTask) {
  return task.run()
}

class ScheduleImmediately implements IScheduledTask {
  closed = false
  private id: number

  constructor (private task: ITask) {
  }

  run () {
    this.id = setImmediate(() => {
      this.closed = true
      this.task()
    })
    return this
  }

  unsubscribe (): void {
    if (this.closed) return
    clearImmediate(this.id)
    this.closed = true
  }
}

class ScheduleRequestAnimationFrame implements IScheduledTask {
  closed = false
  private id: number

  constructor (private task: ITask) {
  }

  run () {
    this.id = requestAnimationFrame(() => {
      this.closed = true
      this.task()
    })
    return this
  }

  unsubscribe (): void {
    if (this.closed) return
    cancelAnimationFrame(this.id)
    this.closed = true
  }
}

class ScheduleInterval implements IScheduledTask {
  closed = false
  private id: any

  constructor (private task: ITask,
               private interval: number) {
  }

  run () {
    this.id = setInterval(() => this.task(), this.interval)
    return this
  }

  unsubscribe (): void {
    clearInterval(this.id)
    this.closed = true
  }
}

class ScheduleTimeout implements IScheduledTask {
  closed = false
  private timer: any

  constructor (private task: ITask, private timeout: number) {
  }

  run () {
    this.timer = setTimeout(() => {
      this.closed = true
      this.task()
    }, this.timeout)
    return this
  }

  unsubscribe (): void {
    if (this.closed) return
    clearTimeout(this.timer)
    this.closed = true
  }
}

class DefaultScheduler implements Scheduler {
  setImmediate (task: ITask): Subscription {
    return run(new ScheduleImmediately(task))
  }

  setInterval (task: ITask, interval: number): Subscription {
    return run(new ScheduleInterval(task, interval))
  }

  setTimeout (task: ITask, relativeTime: number): Subscription {
    return run(new ScheduleTimeout(task, relativeTime))
  }

  requestAnimationFrame (task: ITask): Subscription {
    return run(new ScheduleRequestAnimationFrame(task))
  }

  now (): number {
    return Date.now()
  }
}

export const createScheduler = (): Scheduler => new DefaultScheduler()
