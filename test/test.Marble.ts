/**
 * Created by tushar.mathur on 02/11/16.
 */
import * as t from  'assert'
import {EVENT} from '../src/testing/Events'
import {marble, toMarble} from '../src/testing/Marble'
import {TestScheduler} from '../src/testing/TestScheduler'

test('marble()', () => {
  const message = 'ABC|'
  const events = marble(message)
  const message0 = toMarble(events)
  t.strictEqual(message, message0)
})

test('marble()', () => {
  const message = toMarble([
    EVENT.next(210, 'A'),
    EVENT.next(220, 'B'),
    EVENT.next(230, 'C'),
    EVENT.complete(240)
  ])
  t.strictEqual('-ABC|', message)
})

test('marble()', () => {
  const message = toMarble([
    EVENT.next(200, 'A'),
    EVENT.next(210, 'B'),
    EVENT.next(220, 'C'),
    EVENT.next(230, 'D'),
    EVENT.complete(230)
  ])
  t.strictEqual('ABCD|', message)
})

test('marble()', () => {
  const message = toMarble([
    EVENT.next(220, 'A'),
    EVENT.next(240, 'B'),
    EVENT.next(260, 'C'),
    EVENT.next(280, 'D'),
    EVENT.complete(280)
  ])
  t.strictEqual('--A-B-C-D|', message)
})

test('delay data', () => {
  const sh = TestScheduler.of()
  const source = marble('012|')
  const {results} = sh.start(() => sh.Hot(source))
  t.strictEqual('012|', toMarble(results))
})
