/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler'
import {ISubscription} from '../types/core/ISubscription'
import {ITask} from '../types/ITask'
import {ScheduleTimeout} from './ScheduleTimeout'
import {ScheduleImmediately} from './ScheduleImmediately'
import {IScheduledTask} from '../types/IScheduledTask'
import {ScheduleInterval} from './ScheduleInterval'
import {ScheduleRequestAnimationFrame} from './ScheduleRequestAnimationFrame'

function run (task: IScheduledTask) {
  return task.run()
}
export class DefaultScheduler implements IScheduler {
  setImmediate (task: ITask): ISubscription {
    return run(new ScheduleImmediately(task))
  }

  setInterval (task: ITask, interval: number): ISubscription {
    return run(new ScheduleInterval(task, interval))
  }

  setTimeout (task: ITask, relativeTime: number): ISubscription {
    return run(new ScheduleTimeout(task, relativeTime))
  }

  requestAnimationFrame (task: ITask) {
    return run(new ScheduleRequestAnimationFrame(task))
  }

  now (): number {
    return Date.now()
  }

  static of () {
    return new DefaultScheduler()
  }
}
