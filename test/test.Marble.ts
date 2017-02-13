/**
 * Created by tushar.mathur on 02/11/16.
 */
import test from 'ava'
import {marble, toMarble} from '../src/testing/Marble'
import {EVENT} from '../src/testing/ReactiveEvents'
import {TestScheduler} from '../src/testing/TestScheduler'

test(t => {
  const message = 'ABC|'
  const events = marble(message)
  const message0 = toMarble(events)
  t.is(message, message0)
})

test(t => {
  const message = toMarble([
    EVENT.next(210, 'A'),
    EVENT.next(220, 'B'),
    EVENT.next(230, 'C'),
    EVENT.complete(240)
  ])
  t.is('-ABC|', message)
})

test(t => {
  const message = toMarble([
    EVENT.next(200, 'A'),
    EVENT.next(210, 'B'),
    EVENT.next(220, 'C'),
    EVENT.next(230, 'D'),
    EVENT.complete(230)
  ])
  t.is('ABCD|', message)
})

test(t => {
  const message = toMarble([
    EVENT.next(220, 'A'),
    EVENT.next(240, 'B'),
    EVENT.next(260, 'C'),
    EVENT.next(280, 'D'),
    EVENT.complete(280)
  ])
  t.is('--A-B-C-D|', message)
})

test('delay data', t => {
  const sh = TestScheduler.of()
  const source = marble('012|')
  const {results} = sh.start(() => sh.Hot(source))
  t.is('012|', toMarble(results))
})