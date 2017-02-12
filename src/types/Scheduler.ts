/**
 * Created by tushar.mathur on 30/09/16.
 */
import {Subscription} from './core/Subscription'
import {ITask} from './ITask'


export interface Scheduler {
  delay(task: ITask, relativeTime: number): Subscription
  periodic(task: ITask, interval: number): Subscription
  frame(task: ITask): Subscription
  asap(task: ITask): Subscription
  now(): number
}
