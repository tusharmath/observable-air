import {Scheduler} from '../types/Scheduler'
import {ITask} from '../types/ITask'
import {Subscription} from '../types/core/Subscription'
/**
 * Created by tushar on 05/02/17.
 */

interface Global {
  requestIdleCallback?: Function
  process?: {nextTick: Function}
  setTimeout: Function
}

function getGlobal (): Global {
  return typeof window === 'object' ? window : global
}

export function asap (sh: Scheduler, task: ITask): Subscription {
  const global = getGlobal()
  if (global.requestIdleCallback) return sh.requestIdleCallback(task)
  if (global.process) return sh.nextTick(task)
  return sh.setTimeout(task, 1)
}