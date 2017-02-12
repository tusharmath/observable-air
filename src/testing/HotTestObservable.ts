/**
 * Created by tushar.mathur on 10/10/16.
 */

import {EventType, IEvent} from '../types/IEvent'
import {TestObservable} from './TestObservable'
import {EventNext, EventError} from './ReactiveEvents'
import {TestScheduler} from './TestScheduler'
import {Observer} from '../types/core/Observer'

export function dispatchEvents<T> (event: IEvent, observers: Array<Observer<T>>, closed: Array<boolean>) {
  observers
    .filter((x, i) => !closed[i])
    .forEach(ob => {
      if (event.type === EventType.next) return ob.next((event as EventNext<T>).value)
      if (event.type === EventType.complete) return ob.complete()
      if (event.type === EventType.error) return ob.error((event as EventError).value)
    })
}

export function HotTestObservable<T> (scheduler: TestScheduler, events: Array<IEvent>) {
  const observers: Array<Observer<T>> = []
  const closed: Array<boolean> = []
  events.forEach(ev => {
      scheduler.delay(
        () => dispatchEvents(ev, observers, closed),
        ev.time,
        0)
    }
  )
  return new TestObservable((ob: Observer<T>) => {
    const i = observers.push(ob) - 1
    closed[i] = false
    return {
      unsubscribe () {
        closed[i] = true
      },
      get closed () {
        return closed[i]
      }
    }
  })
}
