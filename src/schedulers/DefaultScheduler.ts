/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {IDisposable} from '../types/IDisposable';
import {ITask} from '../types/ITask';


export class TimeoutDisposable implements IDisposable {
  disposed: boolean;
  private timer: number;

  constructor (private task: ITask, private timeout: number) {
    this.disposed = false
  }

  run () {
    this.timer = setTimeout(() => this.task(), this.timeout)
  }

  dispose (): void {
    clearTimeout(this.timer)
    this.disposed = true
  }
}

export class DefaultScheduler implements IScheduler {
  schedule (task: ITask, relativeTime: number): IDisposable {
    var scheduledTask = new TimeoutDisposable(task, relativeTime);
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
