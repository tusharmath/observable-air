/**
 * Created by tushar.mathur on 04/10/16.
 */

import {ITask} from './ITask';
import {ISubscription} from './core/ISubscription';

// TODO Rename to TaskSchedule
export interface ISchedulingStrategy extends ISubscription {
  run (task: ITask): ISubscription
}
