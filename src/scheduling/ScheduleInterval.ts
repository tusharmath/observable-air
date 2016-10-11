/**
 * Created by tushar.mathur on 08/10/16.
 */

import {IScheduledTask} from '../types/IScheduledTask';
import {IScheduler} from '../types/IScheduler';
import {ITask} from '../types/ITask';
import {ISubscription} from '../types/core/ISubscription';

export class ScheduleInterval implements IScheduledTask {
  closed: boolean;
  private subscription: ISubscription;

  constructor (private task: ITask,
               private interval: number,
               private scheduler: IScheduler) {
  }

  process () {
    if (this.closed) return
    this.task()
    this.run()
  }

  // TODO: Use setInterval() instead
  run () {
    this.subscription = this.scheduler.scheduleTimeout(
      () => this.process(), this.interval
    )
    return this
  }

  unsubscribe (): void {
    if (this.subscription) this.subscription.unsubscribe()
    this.closed = true
  }
}
