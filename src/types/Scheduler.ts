/**
 * Created by tushar.mathur on 30/09/16.
 */
import {Subscription} from './core/Subscription'
import {ITask} from './ITask'


export interface Scheduler {
  setTimeout(task: ITask, relativeTime: number): Subscription
  setInterval(task: ITask, interval: number): Subscription
  requestAnimationFrame(task: ITask): Subscription
  requestAnimationFrames(task: ITask): Subscription
  now(): number
}
