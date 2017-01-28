/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents, EventError} from '../src/testing/ReactiveEvents'
import {interval} from '../src/sources/Interval'
import {toMarble} from '../src/testing/Marble'
import {thrower, ERROR_MESSAGE} from '../src/testing/Thrower'
const {error} = ReactiveEvents

test('subscribe()', t => {
  const sh = TestScheduler.of()
  const {results} = sh.start<number>(() => interval(10), 20, 70)
  t.is(toMarble(results, 20), '-0123')
})

test('subscribe()', t => {
  const sh = TestScheduler.of()
  const observer = sh.Observer<void>()
  thrower(interval(100)).subscribe(observer, sh)
  sh.advanceBy(100)
  t.deepEqual(observer.results, [
    error(100, Error(ERROR_MESSAGE))
  ])
  t.is((observer.results[0] as EventError).value.message, ERROR_MESSAGE)
})
