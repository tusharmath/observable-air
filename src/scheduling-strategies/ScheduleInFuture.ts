/**
 * Created by tushar.mathur on 03/10/16.
 */


import {ITask} from '../types/ITask';
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';

export class ScheduleInFuture implements ISchedulingStrategy {
  closed: boolean;
  private timer: number;

  constructor (private task: ITask, private timeout: number) {
    this.closed = false
  }

  run () {
    this.timer = setTimeout(() => this.task(), this.timeout)
    return this
  }

  unsubscribe (): void {
    clearTimeout(this.timer)
    this.closed = true
  }
}
