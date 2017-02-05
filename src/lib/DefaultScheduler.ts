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

class AnimationFrame implements IScheduledTask {
  closed = false
  private id: number

  constructor (private task: ITask) {
  }

  onFrame () {
    this.closed = true
    this.task()
  }

  run () {
    this.id = requestAnimationFrame(this.onFrame.bind(this))
    return this
  }

  unsubscribe (): void {
    if (this.closed) return
    cancelAnimationFrame(this.id)
    this.closed = true
  }
}

class Interval implements IScheduledTask {
  closed = false
  private id: any

  constructor (private task: ITask,
               private interval: number) {
  }

  run () {
    this.id = setInterval(this.task, this.interval)
    return this
  }

  unsubscribe (): void {
    clearInterval(this.id)
    this.closed = true
  }
}

class Timeout implements IScheduledTask {
  closed = false
  private timer: any

  constructor (private task: ITask, private timeout: number) {
  }

  private onTimeout () {
    this.task()
    this.closed = true
  }

  run () {
    this.timer = setTimeout(this.onTimeout.bind(this), this.timeout)
    return this
  }

  unsubscribe (): void {
    if (this.closed === false) {
      clearTimeout(this.timer)
      this.closed = true
    }
  }
}

class DefaultScheduler implements Scheduler {
  setInterval (task: ITask, interval: number): Subscription {
    return run(new Interval(task, interval))
  }

  setTimeout (task: ITask, relativeTime: number): Subscription {
    return run(new Timeout(task, relativeTime))
  }

  requestAnimationFrame (task: ITask): Subscription {
    return run(new AnimationFrame(task))
  }

  now (): number {
    return Date.now()
  }
}

export const createScheduler = (): Scheduler => new DefaultScheduler()
