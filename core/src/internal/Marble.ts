/**
 * Created by tushar.mathur on 23/10/16.
 */
import {EVENT, EventNext, EventType, IObservableEvent} from './Events'
import {DEFAULT_OPTIONS} from './TestOptions'

export const SIZE = DEFAULT_OPTIONS.marbleSize
export const START = DEFAULT_OPTIONS.subscriptionStart

export function fromMarble(
  message: String,
  start = START,
  size = SIZE
): Array<IObservableEvent> {
  const events: Array<IObservableEvent> = []
  let time = start
  for (let i = 0; i < message.length; ++i) {
    switch (message[i]) {
      case ' ':
        break
      case '(':
        let value = ''
        while (message[++i] !== ')') {
          value += message[i]
        }
        events.push(EVENT.next(time, value))
        time += size
        break
      case '-':
        time += size
        break
      case '|':
        events.push(EVENT.complete(time))
        time += size
        break
      case '#':
        events.push(EVENT.error(time, new Error('#')))
        time += size
        break
      default:
        const m = parseInt(message[i], 10)
        if (isNaN(m)) events.push(EVENT.next(time, message[i]))
        else events.push(EVENT.next(time, m))
        time += size
        break
    }
  }
  return events
}

export function toMarble<T>(
  events: Array<IObservableEvent>,
  start = START,
  size = SIZE
) {
  let time = start - size
  let message = ''
  events.forEach(ev => {
    if (ev.time % size !== 0)
      throw TypeError(`the time (${ev.time}) not a multiple of frame ${size}`)
    let count = (ev.time - time) / size
    time = ev.time
    while (count-- > 1) message += '-'
    switch (ev.type) {
      case EventType.next:
        const s = (ev as EventNext<T>).value.toString()
        message += s.length > 1 ? `(${s})` : s
        break
      case EventType.error:
        message += '#'
        break
      case EventType.complete:
        message += '|'
        break
      case EventType.start:
        message += '^'
        break
      case EventType.end:
        message += '!'
        break
    }
  })
  return message
}
