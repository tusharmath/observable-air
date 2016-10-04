/**
 * Created by tushar.mathur on 30/09/16.
 */

import {IDisposable} from './IDisposable';
import {ITask} from './ITask';

export interface IScheduler {
  schedule(task: ITask, time: number): IDisposable
  scheduleASAP(task: ITask): IDisposable
  now(): number
}
