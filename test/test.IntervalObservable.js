/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {interval} from '../src/sources/Interval'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveTest} from '../src/testing/ReactiveTest'
const {next} = ReactiveTest

test('subscribe()', t => {
  const sh = TestScheduler.of()
  const {results} = sh.startScheduler(() => interval(200))
  t.deepEqual(results, [
    next(400, 0),
    next(600, 1),
    next(800, 2),
    next(1000, 3),
    next(1200, 4),
    next(1400, 5),
    next(1600, 6),
    next(1800, 7),
    next(2000, 8)
  ])
})
