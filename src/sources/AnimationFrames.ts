/**
 * Created by tushar.mathur on 22/10/16.
 */

import {IObservable} from '../types/core/IObservable'
import {IObserver} from '../types/core/IObserver'
import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {DefaultScheduler} from '../scheduling/DefaultScheduler'

export class AnimationFrameSubscription implements ISubscription {
  private count = 0
  private queue = this.scheduler.requestAnimationFrame(() => this.flush())
  closed: boolean = false

  constructor (private sink: IObserver<number>,
               private scheduler: IScheduler) {
  }


  private flush () {
    this.sink.next(this.count++)
    this.queue = this.scheduler.requestAnimationFrame(() => this.flush())
  }

  unsubscribe (): void {
    this.closed = true
    this.queue.unsubscribe()
  }
}

export class AnimationFrames implements IObservable<number> {
  constructor () {
  }

  subscribe (observer: IObserver<number>, scheduler: IScheduler = new DefaultScheduler()): ISubscription {
    return new AnimationFrameSubscription(observer, scheduler)
  }
}

export function animationFrames () {
  return new AnimationFrames()
}
