/**
 * Created by tushar.mathur on 30/09/16.
 */

import {IScheduled} from './IScheduled';
import {IDisposable} from './IDisposable';

export interface IScheduler {
  schedule(task: IScheduled, time: number): IDisposable
  now(): number
}
