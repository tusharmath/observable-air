/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ITask} from './ITask';
export interface IScheduler<T> {
  run(task: ITask): T
  cancel(id: T): void
}
