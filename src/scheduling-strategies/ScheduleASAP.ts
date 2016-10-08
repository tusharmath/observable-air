/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ITask} from '../types/ITask';
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';

export class ScheduleASAP implements ISchedulingStrategy {
  closed: boolean;
  private id: number;

  constructor () {
    this.closed = false
  }

  run (task: ITask) {
    this.id = setImmediate(() => task())
    return this
  }

  unsubscribe (): void {
    clearImmediate(this.id)
    this.closed = true
  }
}
