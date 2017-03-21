/**
 * Created by tushar.mathur on 10/10/16.
 */

import {TestObservable} from './TestObservable'
import {EventNext, IObservableEvent, EventType} from './Events'
import {IObserver} from '../lib/Observer'
import {IScheduler} from '../lib/Scheduler'

export function ColdTestObservable (scheduler: IScheduler, events: Array<IObservableEvent>) {
  return new TestObservable((observer: IObserver<any>) => {
    var closed = false
    for (var i = 0; i < events.length && !closed; i++) {
      const event = events[i]
      if (event.type === EventType.next) {
        scheduler.delay(() => observer.next((<EventNext<any>> event).value), event.time)
      }
      else if (event.type === EventType.complete) {
        scheduler.delay(() => observer.complete(), event.time)
      }
    }
    return {
      unsubscribe () {
        closed = true
      },
      get closed () {
        return closed
      }
    }
  })
}
