/**
 * Created by tushar.mathur on 27/09/16.
 */

;('use strict')

import test from 'ava'
import {scan} from '../src/operators/Scan'
import {interval} from '../src/sources/Interval'
import {EVENT, EventError} from '../src/testing/Events'
import {toMarble} from '../src/testing/Marble'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ERROR_MESSAGE, thrower} from '../src/testing/Thrower'
const {error} = EVENT

test('subscribe()', t => {
  const sh = TestScheduler.of()
  const {results} = sh.start(() => scan(i => i + 1, -1, interval(10)), 200, 250)
  t.is(toMarble(results), '-0123')
})

test('ERROR!', t => {
  const sh = TestScheduler.of()
  const observer = sh.Observer<void>()
  thrower(interval(100)).subscribe(observer, sh)
  sh.advanceBy(100)
  t.deepEqual(observer.results, [error(100, Error(ERROR_MESSAGE))])
  t.is((observer.results[0] as EventError).value.message, ERROR_MESSAGE)
})
