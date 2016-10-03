/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {IDisposable} from '../types/IDisposable';
import {ITask} from '../types/ITask';
import {DisposableTimeout} from '../lib/DisposableTimeout';


export class DefaultScheduler implements IScheduler {
  schedule (task: ITask, relativeTime: number): IDisposable {
    var scheduledTask = new DisposableTimeout(task, relativeTime);
    scheduledTask.run()
    return scheduledTask
  }

  now (): number {
    return Date.now()
  }

  static of () {
    return new DefaultScheduler()
  }
}
