/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {IDisposable} from '../types/IDisposable';
import {ScheduledTask} from '../lib/ScheduledTask';
import {ITask} from '../types/ITask';


export class TimeoutScheduler implements IScheduler {
  schedule (task: ITask, relativeTime: number): IDisposable {
    return new ScheduledTask(task, relativeTime).run()
  }

  now (): number {
    return Date.now()
  }

  static of () {
    return new TimeoutScheduler()
  }
}
