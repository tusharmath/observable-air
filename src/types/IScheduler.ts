/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ISubscription} from './ISubscription';
import {ITask} from './ITask';

export interface IScheduler {
  schedule(task: ITask, time: number): ISubscription
  scheduleASAP(task: ITask): ISubscription
  now(): number
}
