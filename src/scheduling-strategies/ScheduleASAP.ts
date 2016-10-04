/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ITask} from '../types/ITask';
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';

export class ScheduleASAP implements ISchedulingStrategy {
  disposed: boolean;
  private id: number;

  constructor (private task: ITask) {
    this.disposed = false
  }

  run () {
    this.id = setImmediate(() => this.task())
    return this
  }

  dispose (): void {
    clearImmediate(this.id)
    this.disposed = true
  }
}
