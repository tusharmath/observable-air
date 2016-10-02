/**
 * Created by tushar.mathur on 02/10/16.
 */

import {ISchedule} from './types/ISchedule';
import {ITask} from './types/ITask';

export class TaskSchedule implements ISchedule {
  constructor (public task: ITask, public time: number) {
  }

  static of (task: ITask, time: number) {
    return new TaskSchedule(task, time)
  }
}
