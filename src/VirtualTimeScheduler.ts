/**
 * Created by tushar.mathur on 02/10/16.
 */

import {IScheduler} from './types/IScheduler';
import {ITask} from './types/ITask';
import {ISchedule} from './types/ISchedule';
import {TaskSchedule} from './TaskSchedule';


export class VirtualTimeScheduler implements IScheduler {
  queue: Array<ISchedule>;
  clock: number;

  constructor () {
    this.clock = 0
    this.queue = []
  }

  advanceTo (time: number): void {
    this.clock = time
    this.run()
  }

  advanceBy (time: number): void {
    this.clock += time
    this.run()
  }

  schedule (task: ITask, relativeTime: number): ISchedule {
    var schedule = TaskSchedule.of(task, relativeTime);
    this.queue.push(schedule)
    return schedule
  }

  now (): number {
    return this.clock;
  }

  run (): void {
    const residue: Array<ISchedule> = []
    for (var i = 0; i < this.queue.length; ++i) {
      const qItem = this.queue[i];
      if (qItem.time >= this.clock) {
        qItem.task.run()
      }
      residue.push(qItem)
    }
    this.queue = residue
  }
}
