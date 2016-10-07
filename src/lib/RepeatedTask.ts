/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {ITask} from '../types/ITask';
import {ISubscription} from '../core-types/ISubscription';

export class RepeatedTask implements ISubscription {
  closed: boolean;

  constructor (
    private task: ITask,
    private interval: number,
    private scheduler: IScheduler
  ) {
  }

  run (): void {
    this.task()
    if (!this.closed) this.scheduler.schedule(() => this.run(), this.interval)
  }

  unsubscribe (): void {
    this.closed = true
  }
}
