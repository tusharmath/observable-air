/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {IDisposable} from '../types/IDisposable';
import {ITask} from '../types/ITask';
import {ScheduleInFuture} from '../scheduling-strategies/ScheduleInFuture';
import {ScheduleASAP} from '../scheduling-strategies/ScheduleASAP';


export class DefaultScheduler implements IScheduler {
  scheduleASAP (task: ITask): IDisposable {
    var scheduledTask = new ScheduleASAP(task);
    return scheduledTask.run()
  }

  schedule (task: ITask, relativeTime: number): IDisposable {
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
