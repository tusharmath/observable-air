/**
 * Created by tushar.mathur on 03/10/16.
 */

import {IScheduled} from '../types/IScheduled';

export class TaskSchedule {
  constructor (public task: IScheduled,
               public time: number) {
  }
}
