/**
 * Created by tushar.mathur on 02/11/16.
 */
import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {marble, toMarble} from '../src/testing/Marble'
import {air} from '../src/main'

test(t => {
  const sh = TestScheduler.of()
  const message = 'ABCDEFGH|'
  const source$ = sh.Hot(marble(message))
  const {results} = sh.start(() => air(source$).rafThrottle())
  t.is(toMarble(results), '-B-D-F-H|')
})
