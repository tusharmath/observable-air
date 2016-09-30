/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ITask} from '../types/ITask';
import {IScheduler} from '../types/IScheduler';

export class ImmediateScheduler implements IScheduler<number> {
  cancel (id: number): void {
    clearImmediate(id)
  }

  run (task: ITask) {
    return setImmediate(() => task.run())
  }
}
