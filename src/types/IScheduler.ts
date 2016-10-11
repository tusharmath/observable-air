/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ISubscription} from './core/ISubscription';
import {ITask} from './ITask';

export interface IScheduler {
  setTimeout(task: ITask, relativeTime: number): ISubscription
  setImmediate(task: ITask): ISubscription
  setInterval(task: ITask, interval: number): ISubscription
  now(): number
}
