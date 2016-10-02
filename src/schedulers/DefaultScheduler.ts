/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler';
import {IScheduled} from '../types/IScheduled';
import {TaskSchedule} from './TaskSchedule';
import {IDisposable} from '../types/IDisposable';


function disposableTimeout (func: () => void, time: number): IDisposable {
  const timeout = setTimeout(func, time)
  return {dispose: () => clearTimeout(timeout)}
}


export class DefaultScheduler implements IScheduler {
  protected queue: Array<TaskSchedule>;

  constructor () {
    this.queue = []
  }

  addToQueue (task: IScheduled, relativeTime: number) {
    const time = relativeTime <= 0 ? 1 : relativeTime
    const taskSchedule = new TaskSchedule(task, this.now() + time);
    this.queue.push(taskSchedule)
    return taskSchedule
  }

  schedule (task: IScheduled, relativeTime: number): IDisposable {
    this.addToQueue(task, relativeTime)
    return disposableTimeout(() => this.run(), relativeTime)
  }

  now (): number {
    return Date.now()
  }

  run (): void {
    const residue: Array<TaskSchedule> = []
    for (var i = 0; i < this.queue.length; ++i) {
      const qItem = this.queue[i];
      if (qItem.time <= this.now()) {
        qItem.task.run()
      } else {
        residue.push(qItem)
      }
    }
    this.queue = residue
  }
}
