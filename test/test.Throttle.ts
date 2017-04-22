/**
 * Created by tushar on 27/01/17.
 */
import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {marble, toMarble} from '../src/testing/Marble'
import {throttle} from '../src/operators/Throttle'

test(t => {
  const sh = TestScheduler.of()
  const source = marble('123456789|')
  const {results} = sh.start(() => throttle(11, sh.Hot(source)))
  t.is(toMarble(results), '1-3-5-7-9|')
})

test('unsubscribe()', t => {
  const sh = TestScheduler.of()
  const source = marble('1----------', 10)
  sh.start(() => throttle(30, sh.Hot(source)), 10, 25)
  t.is(sh.queue.length, 0)
})
