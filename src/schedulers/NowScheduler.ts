/**
 * Created by tushar.mathur on 30/09/16.
 */

import {ITask} from '../types/ITask';
import {IScheduler} from '../types/IScheduler';

export class NowScheduler implements IScheduler<void> {
  cancel (id: void): void {
  }

  run (task: ITask) {
    task.run()
  }
}
