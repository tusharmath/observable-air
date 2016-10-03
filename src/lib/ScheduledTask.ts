/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IDisposable} from '../types/IDisposable';
import {ITask} from '../types/ITask';

export class ScheduledTask implements IDisposable {
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
