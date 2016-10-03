/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {interval} from '../src/sources/Interval'
import {VirtualTimeScheduler} from '../src/schedulers/VirtualTimeScheduler'
import {ReactiveTest} from '../src/lib/ReactiveTest'
const {next} = ReactiveTest

test('subscribe()', t => {
  const sh = VirtualTimeScheduler.of()
  const {results} = sh.startScheduler(() => interval(200, sh))
  t.deepEqual(results, [
    next(200, 0),
    next(400, 1),
    next(600, 2),
    next(800, 3),
    next(1000, 4),
    next(1200, 5),
    next(1400, 6),
    next(1600, 7),
    next(1800, 8),
    next(2000, 9)
  ])
})
