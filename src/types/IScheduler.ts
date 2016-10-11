/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ISubscription} from './core/ISubscription';
import {ITask} from './ITask';

export interface IScheduler {
  scheduleTimeout(task: ITask, relativeTime: number): ISubscription
  scheduleImmediately(task: ITask): ISubscription
  scheduleInterval(task: ITask, interval: number): ISubscription
  now(): number
}
