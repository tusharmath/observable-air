/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {ITask} from '../types/ITask';
import {IDisposable} from '../types/IDisposable';

export class RepeatedTask implements ITask, IDisposable {
  disposed: boolean;

  constructor (
    private task: ITask,
    private interval: number,
    private scheduler: IScheduler
  ) {
  }

  run (): void {
    this.task.run()
    if (!this.disposed) this.scheduler.schedule(this, this.interval)
  }

  dispose (): void {
    this.disposed = true
  }
}
