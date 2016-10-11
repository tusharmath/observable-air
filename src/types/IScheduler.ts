/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ISubscription} from './core/ISubscription';
import {ITask} from './ITask';
import {ISchedulingStrategy} from './ISchedulingStrategy';

export interface IScheduler {
  schedule(task: ITask, relativeTime: number): ISubscription
  scheduleASAP(task: ITask): ISubscription
  scheduleNow(task: ITask): ISubscription
  scheduleRepeatedly(task: ITask, interval: number): ISubscription
  scheduleUsing(strategy: ISchedulingStrategy, task: ITask): ISubscription
  now(): number
}
