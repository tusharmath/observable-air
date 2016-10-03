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
  const {results} = sh.startScheduler(() => interval(100, sh))
  t.deepEqual(results, [
    next(200, 0),
    next(300, 1),
    next(400, 2),
    next(500, 3),
    next(600, 4),
    next(700, 5),
    next(800, 6),
    next(900, 7),
    next(1000, 8)
  ])
})
