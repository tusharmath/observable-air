/**
 * Created by tushar.mathur on 11/10/16.
 */

import {IScheduledTask} from '../types/IScheduledTask'
import {ITask} from '../types/ITask'

export class ScheduleRequestAnimationFrame implements IScheduledTask {
  closed: boolean
  private id: number

  constructor (private task: ITask) {
  }

  run () {
    this.id = requestAnimationFrame(() => {
      this.task()
      this.closed = true
    })
    return this
  }

  unsubscribe (): void {
    if (this.closed) return
    cancelAnimationFrame(this.id)
    this.closed = true
  }
}
