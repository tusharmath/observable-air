/**
 * Created by tushar.mathur on 07/10/16.
 */


import {ITask} from '../types/ITask';
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';

export class ScheduleNow implements ISchedulingStrategy {
  closed: boolean;

  constructor (private task: ITask) {
    this.closed = false
  }

  run () {
    this.task()
    return this
  }

  unsubscribe (): void {
    this.closed = true
  }
}
