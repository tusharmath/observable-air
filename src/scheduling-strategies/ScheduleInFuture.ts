/**
 * Created by tushar.mathur on 03/10/16.
 */


import {ITask} from '../types/ITask';
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';

export class ScheduleInFuture implements ISchedulingStrategy {
  closed: boolean;
  private timer: number;

  constructor (private timeout: number) {
    this.closed = false
  }

  run (task: ITask) {
    this.timer = setTimeout(() => !this.closed && task(), this.timeout)
    return this
  }

  unsubscribe (): void {
    clearTimeout(this.timer)
    this.closed = true
  }
}
