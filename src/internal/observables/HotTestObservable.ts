/**
 * Created by tushar.mathur on 10/10/16.
 */

import {TestScheduler} from '../../schedulers/TestScheduler'
import {EventError, EventNext, EventType} from '../Events'
import {TestObservable} from './TestObservable'

export function dispatchEvents<T>(
  event: IObservableEvent,
  observers: Array<IObserver<T>>,
  closed: Array<boolean>
) {
  observers.filter((x, i) => !closed[i]).forEach(ob => {
    if (event.type === EventType.next)
      return ob.next((event as EventNext<T>).value)
    if (event.type === EventType.complete) return ob.complete()
    if (event.type === EventType.error)
      return ob.error((event as EventError).value)
  })
}

export function HotTestObservable<T>(
  scheduler: TestScheduler,
  events: Array<IObservableEvent>
) {
  const observers: Array<IObserver<T>> = []
  const closed: Array<boolean> = []
  events.forEach(ev => {
    scheduler.delay(() => dispatchEvents(ev, observers, closed), ev.time, 0)
  })
  return new TestObservable((ob: IObserver<T>) => {
    const i = observers.push(ob) - 1
    closed[i] = false
    return {
      unsubscribe() {
        closed[i] = true
      },
      get closed() {
        return closed[i]
      }
    }
  })
}
