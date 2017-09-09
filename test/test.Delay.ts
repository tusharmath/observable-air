/**
 * Created by tushar on 29/01/17.
 */
import * as t from 'assert'
import {delay} from '../src/operators/Delay'
import {EVENT} from '../src/testing/Events'
import {marble, toMarble} from '../src/testing/Marble'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ERROR_MESSAGE, thrower} from '../src/testing/Thrower'

test('delay', () => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => delay(20, sh.Hot(marble('12345|'))))
  t.strictEqual(toMarble(results), '--12345|')
})

test('error', () => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => delay(20, sh.Hot(marble('--#|'))))
  t.strictEqual(toMarble(results), '--#--|')
})

test('exception', () => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => thrower(delay(20, sh.Hot(marble('0')))))
  t.deepEqual(results, [EVENT.error(220, Error(ERROR_MESSAGE))])
})

test('unsubscribe', () => {
  const sh = TestScheduler.of()
  sh.start(() => delay(50, sh.Hot(marble('0'))), 200, 230)
  t.strictEqual(sh.length, 0)
})
