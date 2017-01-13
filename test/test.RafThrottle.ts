/**
 * Created by tushar.mathur on 02/11/16.
 */
import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {marble, toMarble} from '../src/testing/Marble'
import {from} from '../src/Main'

test(t => {
  const sh = TestScheduler.of()
  const message = 'ABCDEFGH|'
  const source$ = sh.Hot(marble(message))
  const {results} = sh.start(() => from(source$).rafThrottle())
  t.is(toMarble(results), '-B-D-F-H|')
})
