/**
 * Created by tushar.mathur on 30/09/16.
 */
import {Subscription} from './core/Subscription'

export interface Scheduler {
  delay(task: () => void, relativeTime: number): Subscription
  periodic(task: () => void, interval: number): Subscription
  frame(task: () => void): Subscription
  asap(task: () => void): Subscription
  now(): number
}
