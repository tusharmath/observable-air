/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ITask} from './ITask';
import {ISchedule} from './ISchedule';
export interface IScheduler extends ITask {
  schedule(task: ITask, relativeTime: number): ISchedule
  now(): number
}
