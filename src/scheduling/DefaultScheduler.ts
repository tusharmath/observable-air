/**
 * Created by tushar.mathur on 03/10/16.
 */


import {IScheduler} from '../types/IScheduler'
import {Subscription} from '../types/core/Subscription'
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
  setImmediate (task: ITask): Subscription {
    return run(new ScheduleImmediately(task))
  }

  setInterval (task: ITask, interval: number): Subscription {
    return run(new ScheduleInterval(task, interval))
  }

  setTimeout (task: ITask, relativeTime: number): Subscription {
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
