/**
 * Created by tushar.mathur on 03/10/16.
 */
import {Scheduler} from '../types/Scheduler'
import {Subscription} from '../types/core/Subscription'
import {ITask} from '../types/ITask'

interface Global {
  requestIdleCallback?: Function
  process?: {nextTick: Function}
}

function getGlobal (): Global {
  return typeof window === 'object' ? window : global
}

class Periodic implements Subscription {
  closed = false
  private id: number

  constructor (private task: ITask,
               private interval: number) {
    this.id = setInterval(this.onEvent, this.interval) as any as number
  }

  private onEvent = () => {
    if (!this.closed) this.task()
  }

  unsubscribe (): void {
    if (this.closed) return
    this.closed = true
    clearInterval(this.id)
  }
}
class Delay implements Subscription {
  closed = false
  private timer: number

  constructor (private task: ITask, private timeout: number) {
    this.timer = setTimeout(this.onEvent, this.timeout) as any as number
  }

  private onEvent () {
    if (this.closed) return
    this.task()
    this.closed = true
  }

  unsubscribe (): void {
    if (this.closed === false) {
      this.closed = true
      clearTimeout(this.timer)
    }
  }
}
class ASAP implements Subscription {
  closed = false

  constructor (private task: ITask) {
    const global = getGlobal()
    if (global.requestIdleCallback) global.requestIdleCallback(this.onEvent)
    else if (global.process) global.process.nextTick(this.onEvent)
    else Promise.resolve().then(this.onEvent)
  }

  private onEvent = () => {
    if (!this.closed) this.task()
  }

  unsubscribe (): void {
    if (this.closed === false) this.closed = true
  }

}
class Frames implements Subscription {
  closed = false
  private frame: number

  constructor (private task: ITask) {
    this.frame = requestAnimationFrame(this.onEvent)
  }

  private onEvent = () => {
    if (this.closed) return
    this.task()
    this.frame = requestAnimationFrame(this.onEvent)
  }

  unsubscribe (): void {
    if (this.closed) return
    this.closed = true
    cancelAnimationFrame(this.frame)
  }

}
class DefaultScheduler implements Scheduler {
  frame (task: ITask): Subscription {
    return new Frames(task)
  }

  asap (task: ITask): Subscription {
    return new ASAP(task)
  }

  periodic (task: ITask, interval: number): Subscription {
    return new Periodic(task, interval)
  }

  delay (task: ITask, relativeTime: number): Subscription {
    return new Delay(task, relativeTime)
  }

  now (): number {
    return Date.now()
  }
}
export const createScheduler = (): Scheduler => new DefaultScheduler()
