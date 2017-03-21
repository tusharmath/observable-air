/**
 * Created by tushar.mathur on 03/10/16.
 */
import {ISubscription} from './Subscription'

interface Global {
  requestIdleCallback?: Function
  process?: {nextTick: Function}
}

export interface IScheduler {
  delay(task: () => void, relativeTime: number): ISubscription
  periodic(task: () => void, interval: number): ISubscription
  frame(task: () => void): ISubscription
  asap(task: () => void): ISubscription
  now(): number
}

function getGlobal (): Global {
  return typeof window === 'object' ? window : global
}

class Periodic implements ISubscription {
  closed = false
  private id: number

  constructor (private task: () => void,
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
class Delay implements ISubscription {
  closed = false

  constructor (private task: () => void, private timeout: number) {
    setTimeout(this.onEvent.bind(this), this.timeout)
  }

  private onEvent () {
    if (this.closed) return
    this.task()
    this.closed = true
  }

  unsubscribe (): void {
    if (this.closed === false) {
      this.closed = true
    }
  }
}
class ASAP implements ISubscription {
  closed = false

  constructor (private task: () => void) {
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
class Frames implements ISubscription {
  closed = false
  private frame: number

  constructor (private task: () => void) {
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
class Scheduler implements IScheduler {
  frame (task: () => void): ISubscription {
    return new Frames(task)
  }

  asap (task: () => void): ISubscription {
    return new ASAP(task)
  }

  periodic (task: () => void, interval: number): ISubscription {
    return new Periodic(task, interval)
  }

  delay (task: () => void, relativeTime: number): ISubscription {
    return new Delay(task, relativeTime)
  }

  now (): number {
    return Date.now()
  }
}
export const createScheduler = (): IScheduler => new Scheduler()
