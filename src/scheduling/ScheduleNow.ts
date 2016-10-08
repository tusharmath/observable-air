/**
 * Created by tushar.mathur on 07/10/16.
 */


import {ITask} from '../types/ITask';
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';

export class ScheduleNow implements ISchedulingStrategy {
  closed: boolean;

  constructor () {
    this.closed = false
  }

  run (task: ITask) {
    !this.closed && task()
    return this
  }

  unsubscribe (): void {
    this.closed = true
  }
}
