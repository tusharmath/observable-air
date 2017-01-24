/**
 * Created by tushar.mathur on 17/10/16.
 */

import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {merge} from '../src/main'

test(t => {
  const sh = TestScheduler.of()
  const a$ = sh.Hot([
    ReactiveEvents.next(210, 'A0'),
    ReactiveEvents.next(220, 'A1'),
    ReactiveEvents.complete(230)
  ])
  const b$ = sh.Hot([
    ReactiveEvents.next(212, 'B0'),
    ReactiveEvents.next(222, 'B1'),
    ReactiveEvents.complete(232)
  ])
  const c$ = sh.Hot([
    ReactiveEvents.next(215, 'C0'),
    ReactiveEvents.next(225, 'C1'),
    ReactiveEvents.complete(235)
  ])
  const {results} = sh.start(() => merge(a$, b$, c$))
  t.deepEqual(results, [
    ReactiveEvents.next(210, 'A0'),
    ReactiveEvents.next(212, 'B0'),
    ReactiveEvents.next(215, 'C0'),
    ReactiveEvents.next(220, 'A1'),
    ReactiveEvents.next(222, 'B1'),
    ReactiveEvents.next(225, 'C1'),
    ReactiveEvents.complete(235)
  ])
})
