import {EventType, IEvent} from '../types/IEvent';
import {TestObservable} from './TestObservable';
import {ISubscriptionObserver} from '../types/core/ISubscriptionObserver';
import {EventNext, EventError} from './ReactiveTest';
import {IObserver} from '../types/core/IObserver';
import {TestScheduler} from './TestScheduler';
/**
 * Created by tushar.mathur on 10/10/16.
 */


export function dispatchEvents<T> (event: IEvent, observers: Array<IObserver<T>>, closed: Array<boolean>) {
  observers
    .filter((x, i) => !closed[i])
    .forEach(ob => {
      if (event.type === EventType.next) return ob.next((event as EventNext<T>).value)
      if (event.type === EventType.complete) return ob.complete()
      if (event.type === EventType.error) return ob.error((event as EventError).value)
    })
}

export function HotTestObservable<T> (scheduler: TestScheduler, events: Array<IEvent>) {
  const observers: Array<IObserver<T>> = []
  const closed: Array<boolean> = []
  events.forEach(ev => {
      scheduler.scheduleAbsolute(
        () => dispatchEvents(ev, observers, closed),
        ev.time)
    }
  )
  return new TestObservable((ob: ISubscriptionObserver<T>) => {
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
