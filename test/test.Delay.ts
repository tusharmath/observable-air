/**
 * Created by tushar on 29/01/17.
 */
import {test} from 'ava'
import {delay} from '../src/main'
import {TestScheduler} from '../src/testing/TestScheduler'
import {marble, toMarble} from '../src/testing/Marble'
import {thrower, ERROR_MESSAGE} from '../src/testing/Thrower'
import {EVENT} from '../src/testing/ReactiveEvents'

test(t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => delay(20, sh.Hot(marble('12345|'))))
  t.is(toMarble(results), '--12345|')
})

test('error', t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => delay(20, sh.Hot(marble('--#|'))))
  t.is(toMarble(results), '--#--|')
})

test('exception', t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => thrower(delay(20, sh.Hot(marble('0')))))
  t.deepEqual(results, [
    EVENT.error(220, Error(ERROR_MESSAGE))
  ])
})

test('unsubscribe', t => {
  const sh = TestScheduler.of()
  sh.start(() => delay(50, sh.Hot(marble('0'))), 200, 230)
  t.is(sh.length, 0)
})