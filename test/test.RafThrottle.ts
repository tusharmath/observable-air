/**
 * Created by tushar.mathur on 02/11/16.
 */

import test from 'ava'
import {rafThrottle} from '../src/operators/RafThrottle'
import {TestScheduler} from '../src/testing/TestScheduler'
import {marble, toMarble} from '../src/testing/Marble'

test(t => {
  const sh = TestScheduler.of()
  const message = 'ABCDEFGH|'
  const source$ = sh.Hot(marble(message))
  const {results} = sh.start(() => rafThrottle(source$))
  t.is(toMarble(results), '-B-D-F-H|')
})
