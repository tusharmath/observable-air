/**
 * Created by tushar.mathur on 30/09/16.
 */

import {Subscription} from './core/ISubscription'
import {ITask} from './ITask'

export interface IScheduler {
  setTimeout(task: ITask, relativeTime: number): Subscription
  setImmediate(task: ITask): Subscription
  setInterval(task: ITask, interval: number): Subscription
  requestAnimationFrame(task: ITask): Subscription
  now(): number
}
