/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {ISubscription} from '../types/core/ISubscription';
import {ITask} from '../types/ITask';
import {ScheduleInFuture} from '../scheduling-strategies/ScheduleInFuture';
import {ScheduleASAP} from '../scheduling-strategies/ScheduleASAP';
import {ScheduleNow} from '../scheduling-strategies/ScheduleNow';


export class DefaultScheduler implements IScheduler {
  scheduleNow (task: ITask): ISubscription {
    return new ScheduleNow(task).run()
  }

  scheduleASAP (task: ITask): ISubscription {
    var scheduledTask = new ScheduleASAP(task);
    return scheduledTask.run()
  }

  schedule (task: ITask, relativeTime: number): ISubscription {
    var scheduledTask = new ScheduleInFuture(task, relativeTime);
    return scheduledTask.run()
  }

  now (): number {
    return Date.now()
  }

  static of () {
    return new DefaultScheduler()
  }
}
