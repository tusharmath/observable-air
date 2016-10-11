/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {ISubscription} from '../types/core/ISubscription';
import {ITask} from '../types/ITask';
import {ScheduleTimeout} from './ScheduleTimeout';
import {ScheduleImmediately} from './ScheduleImmediately';
import {IScheduledTask} from '../types/IScheduledTask';
import {ScheduleInterval} from './ScheduleInterval';

function run (task: IScheduledTask) {
  return task.run()
}
export class DefaultScheduler implements IScheduler {
  scheduleImmediately (task: ITask): ISubscription {
    return run(new ScheduleImmediately(task))
  }

  scheduleInterval (task: ITask, interval: number): ISubscription {
    return run(new ScheduleInterval(task, interval, this))
  }

  scheduleTimeout (task: ITask, relativeTime: number): ISubscription {
    return run(new ScheduleTimeout(task, relativeTime))
  }


  now (): number {
    return Date.now()
  }

  static of () {
    return new DefaultScheduler()
  }
}
