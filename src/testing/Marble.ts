/**
 * Created by tushar.mathur on 23/10/16.
 */

import {START_SUBSCRIPTION_TIME} from './TestScheduler'
import {IEvent} from '../types/IEvent'
import {ReactiveEvents} from './ReactiveEvents'

export function marble <T> (message: String, err: Error = new Error()): Array<IEvent> {
  var events: Array<IEvent> = []
  var time = START_SUBSCRIPTION_TIME
  for (var i = 0; i < message.length; ++i) {
    time += 10
    switch (message[i]) {
      case '-' :
        break
      case '|':
        events.push(ReactiveEvents.complete(time))
        break
      case '!':
        events.push(ReactiveEvents.error(time, err))
        break
      default:
        events.push(ReactiveEvents.next(time, message[i]))
        break
    }
  }
  return events
}
