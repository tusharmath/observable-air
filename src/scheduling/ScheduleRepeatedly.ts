/**
 * Created by tushar.mathur on 08/10/16.
 */

import {ISchedulingStrategy} from '../types/ISchedulingStrategy';
import {IScheduler} from '../types/IScheduler';
import {ITask} from '../types/ITask';
import {ISubscription} from '../types/core/ISubscription';

export class ScheduleRepeatedly implements ISchedulingStrategy {
  closed: boolean;
  private subscription: ISubscription;

  constructor (private interval: number,
               private scheduler: IScheduler) {
  }

  process (task: ITask) {
    if (this.closed) return
    task()
    this.run(task)
  }

  run (task: ITask) {
    this.subscription = this.scheduler.schedule(
      () => this.process(task), this.interval
    )
    return this
  }

  unsubscribe (): void {
    if (this.subscription) this.subscription.unsubscribe()
    this.closed = true
  }
}
