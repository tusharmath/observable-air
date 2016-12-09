/**
 * Created by tushar.mathur on 24/10/16.
 */

import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {map} from '../src/operators/Map'
import {TestObserver} from '../src/testing/TestObserver'
import {multicast} from '../src/operators/Multicast'

test(t => {
  let i = 0
  const sh = TestScheduler.of()
  const ob0 = new TestObserver(sh)
  const ob1 = new TestObserver(sh)
  const t$ = multicast(map((x: {(): number}) => x(), sh.Hot([
    ReactiveEvents.next(10, () => ++i),
    ReactiveEvents.next(20, () => ++i),
    ReactiveEvents.next(30, () => ++i),
    ReactiveEvents.next(40, () => ++i),
    ReactiveEvents.next(50, () => ++i)
  ])))
  t$.subscribe(ob0, sh)
  t$.subscribe(ob1, sh)
  sh.advanceBy(50)
  t.deepEqual(ob0, ob1)
  t.deepEqual(ob0.results, [
    ReactiveEvents.next(10, 1),
    ReactiveEvents.next(20, 2),
    ReactiveEvents.next(30, 3),
    ReactiveEvents.next(40, 4),
    ReactiveEvents.next(50, 5)
  ])
})
