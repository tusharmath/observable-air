/**
 * Created by tushar.mathur on 23/10/16.
 */
import {IEvent, EventType} from '../types/IEvent'
import {ReactiveEvents, EventNext} from './ReactiveEvents'
import {OptionType, resolveOptions} from './TestOptions'

// todo: migrate all tests to use marble
// todo: configurations should be arguments and not globally set once
export const MARBLE_SIZE = 10

export function marble (message: String,
                        err: Error = new Error(),
                        o?: OptionType): Array<IEvent> {
  const options = resolveOptions(o)
  const events: Array<IEvent> = []
  let time = options.start
  for (let i = 0; i < message.length; ++i) {
    switch (message[i]) {
      case '-' :
        break
      case '|':
        events.push(ReactiveEvents.complete(time))
        break
      case '#':
        events.push(ReactiveEvents.error(time, err))
        break
      default:
        events.push(ReactiveEvents.next(time, message[i]))
        break
    }
    time += MARBLE_SIZE
  }
  return events
}

export function toMarble<T> (events: Array<IEvent>,
                             o?: OptionType) {
  const options = resolveOptions(o)
  let time = options.start - options.size
  let message = ''
  events.forEach(ev => {
    if (ev.time % MARBLE_SIZE !== 0)
      throw TypeError(`the time (${ev.time}) not a multiple of frame ${MARBLE_SIZE}`)
    let count = (ev.time - time) / MARBLE_SIZE
    time = ev.time
    while (count-- > 1) message += '-'
    switch (ev.type) {
      case EventType.next:
        message += (ev as EventNext<T>).value.toString()
        break
      case EventType.error:
        message += '#'
        break
      case EventType.complete:
        message += '|'
        break
    }
  })
  return message
}
