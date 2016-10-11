/**
 * Created by tushar.mathur on 11/10/16.
 */

import {IScheduledTask} from '../types/IScheduledTask';
import {ITask} from '../types/ITask';

export class ScheduleRequestAnimationFrame implements IScheduledTask {
  closed: boolean;
  private id: number;

  constructor (private task: ITask) {
  }

  run () {
    this.id = requestAnimationFrame(() => this.task())
    return this
  }

  unsubscribe (): void {
    cancelAnimationFrame(this.id)
    this.closed = true
  }
}
