/**
 * Created by tushar.mathur on 02/11/16.
 */
import test from 'ava'
import {marble, toMarble} from '../src/testing/Marble'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {TestScheduler} from '../src/testing/TestScheduler'

test(t => {
  const message = 'ABC|'
  const events = marble(message)
  const message0 = toMarble(events)
  t.is(message, message0)
})

test(t => {
  const message = toMarble([
    ReactiveEvents.next(210, 'A'),
    ReactiveEvents.next(220, 'B'),
    ReactiveEvents.next(230, 'C'),
    ReactiveEvents.complete(240)
  ])
  t.is('-ABC|', message)
})

test(t => {
  const message = toMarble([
    ReactiveEvents.next(200, 'A'),
    ReactiveEvents.next(210, 'B'),
    ReactiveEvents.next(220, 'C'),
    ReactiveEvents.next(230, 'D'),
    ReactiveEvents.complete(230)
  ])
  t.is('ABCD|', message)
})

test(t => {
  const message = toMarble([
    ReactiveEvents.next(220, 'A'),
    ReactiveEvents.next(240, 'B'),
    ReactiveEvents.next(260, 'C'),
    ReactiveEvents.next(280, 'D'),
    ReactiveEvents.complete(280)
  ])
  t.is('--A-B-C-D|', message)
})

test('delay data', t => {
  const sh = TestScheduler.of()
  const source = marble('012|')
  const {results} = sh.start(() => sh.Hot(source))
  t.is('012|', toMarble(results))
})