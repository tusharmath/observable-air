/**
 * Created by tushar.mathur on 08/10/16.
 */

import {IScheduledTask} from '../types/IScheduledTask'
import {ITask} from '../types/ITask'

export class ScheduleInterval implements IScheduledTask {
  closed = false
  private id: number

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
