/**
 * Created by tushar.mathur on 07/10/16.
 */


import {ITask} from '../types/ITask';
import {IScheduledTask} from '../types/IScheduledTask';

export class ScheduleNow implements IScheduledTask {
  closed: boolean;

  constructor (private task: ITask) {
    this.closed = false
  }

  run () {
    !this.closed && this.task()
    return this
  }

  unsubscribe (): void {
    this.closed = true
  }
}
