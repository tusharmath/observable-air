/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ITask} from '../types/ITask';
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';

export class ScheduleASAP implements ISchedulingStrategy {
  closed: boolean;
  private id: number;

  constructor (private task: ITask) {
    this.closed = false
  }

  run () {
    this.id = setImmediate(() => this.task())
    return this
  }

  unsubscribe (): void {
    clearImmediate(this.id)
    this.closed = true
  }
}
