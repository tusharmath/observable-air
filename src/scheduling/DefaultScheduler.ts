/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {ISubscription} from '../types/core/ISubscription';
import {ITask} from '../types/ITask';
import {ScheduleInFuture} from './ScheduleInFuture';
import {ScheduleASAP} from './ScheduleASAP';
import {ScheduleNow} from './ScheduleNow';
import {ISchedulingStrategy} from '../types/ISchedulingStrategy';
import {ScheduleRepeatedly} from './ScheduleRepeatedly';

export class DefaultScheduler implements IScheduler {
  scheduleUsing (strategy: ISchedulingStrategy, task: ITask): ISubscription {
    return strategy.run(task);
  }

  scheduleNow (task: ITask): ISubscription {
    return this.scheduleUsing(new ScheduleNow(), task)
  }

  scheduleASAP (task: ITask): ISubscription {
    return this.scheduleUsing(new ScheduleASAP(), task)
  }

  scheduleRepeatedly (task: ITask, interval: number): ISubscription {
    return this.scheduleUsing(new ScheduleRepeatedly(interval, this), task)
  }

  schedule (task: ITask, relativeTime: number): ISubscription {
    return this.scheduleUsing(new ScheduleInFuture(relativeTime), task)
  }


  now (): number {
    return Date.now()
  }

  static of () {
    return new DefaultScheduler()
  }
}
