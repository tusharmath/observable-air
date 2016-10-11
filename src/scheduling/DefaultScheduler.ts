/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {ISubscription} from '../types/core/ISubscription';
import {ITask} from '../types/ITask';
import {ScheduleInFuture} from './ScheduleInFuture';
import {ScheduleASAP} from './ScheduleASAP';
import {ScheduleNow} from './ScheduleNow';
import {IScheduledTask} from '../types/IScheduledTask';
import {ScheduleRepeatedly} from './ScheduleRepeatedly';

export class DefaultScheduler implements IScheduler {
  scheduleUsing (strategy: IScheduledTask): ISubscription {
    return strategy.run();
  }

  scheduleNow (task: ITask): ISubscription {
    return this.scheduleUsing(new ScheduleNow(task))
  }

  scheduleASAP (task: ITask): ISubscription {
    return this.scheduleUsing(new ScheduleASAP(task))
  }

  scheduleRepeatedly (task: ITask, interval: number): ISubscription {
    return this.scheduleUsing(new ScheduleRepeatedly(task, interval, this))
  }

  schedule (task: ITask, relativeTime: number): ISubscription {
    return this.scheduleUsing(new ScheduleInFuture(task, relativeTime))
  }


  now (): number {
    return Date.now()
  }

  static of () {
    return new DefaultScheduler()
  }
}
