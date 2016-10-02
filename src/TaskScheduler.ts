/**
 * Created by tushar.mathur on 02/10/16.
 */

import {IScheduler} from './types/IScheduler';
import {ITask} from './types/ITask';
import {ISchedule} from './types/ISchedule';
import {TaskSchedule} from './TaskSchedule';


export class TaskScheduler implements IScheduler {
  paused: Boolean;
  schedules: Array<ISchedule>;
  clock: number;

  constructor () {
    this.clock = 0
    this.schedules = []
    this.paused = true
  }

  advanceTo (time: number): void {
    this.clock = time
    this.run()
  }

  advanceBy (time: number): void {
    this.clock += time
    this.run()
  }

  scheduleRelative (task: ITask, time: number): ISchedule {
    var schedule = TaskSchedule.of(task, time + this.clock);
    this.schedules.push(schedule)
    return schedule
  }

  scheduleAbsolute (task: ITask, time: number): ISchedule {
    var schedule = TaskSchedule.of(task, time);
    this.schedules.push(schedule)
    return schedule
  }

  removeSchedule (schedule: ISchedule): void {
    var id = this.schedules.indexOf(schedule)
    this.schedules.splice(id, 1)
  }

  start (): void {
    this.paused = false
  }

  stop (): void {
    this.paused = true
  }

  run (): void {
    if (this.paused) return
    for (var i = 0; i < this.schedules.length; ++i) {
      if (this.schedules[i].time >= this.clock) {
        this.schedules[i].task.run()
      }
    }
  }
}
