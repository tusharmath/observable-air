/**
 * Created by tushar.mathur on 03/10/16.
 */


import {ITask} from '../types/ITask'
import {IScheduledTask} from '../types/IScheduledTask'

export class ScheduleTimeout implements IScheduledTask {
  closed = false
  private timer: number

  constructor (private task: ITask, private timeout: number) {
  }

  run () {
    this.timer = setTimeout(() => {
      this.task()
      this.closed = true
    }, this.timeout)
    return this
  }

  unsubscribe (): void {
    if (this.closed) return
    clearTimeout(this.timer)
    this.closed = true
  }
}
