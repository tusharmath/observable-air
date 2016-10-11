/**
 * Created by tushar.mathur on 08/10/16.
 */

import {IScheduledTask} from '../types/IScheduledTask';
import {IScheduler} from '../types/IScheduler';
import {ITask} from '../types/ITask';
import {ISubscription} from '../types/core/ISubscription';

export class ScheduleRepeatedly implements IScheduledTask {
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

  run () {
    this.subscription = this.scheduler.schedule(
      () => this.process(), this.interval
    )
    return this
  }

  unsubscribe (): void {
    if (this.subscription) this.subscription.unsubscribe()
    this.closed = true
  }
}
