/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ITask} from './ITask';
import {ISchedule} from './ISchedule';
export interface IScheduler extends ITask {
  advanceTo(time: number): void
  advanceBy(time: number): void
  scheduleRelative(task: ITask, time: number): ISchedule
  scheduleAbsolute(task: ITask, time: number): ISchedule
  removeSchedule(schedule: ISchedule): void
  start(): void
  stop(): void
  readonly clock: number
  readonly schedules: Array<ISchedule>
  readonly paused: Boolean
}
