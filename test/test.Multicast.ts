/**
 * Created by tushar.mathur on 24/10/16.
 */

import test from 'ava'
import {map} from '../src/operators/Map'
import {multicast} from '../src/operators/Multicast'
import {EVENT} from '../src/testing/Events'
import {TestObserver} from '../src/testing/TestObserver'
import {TestScheduler} from '../src/testing/TestScheduler'

test(t => {
  let i = 0
  const sh = TestScheduler.of()
  const ob0 = new TestObserver(sh)
  const ob1 = new TestObserver(sh)
  const t$ = multicast(map((x: {(): number}) => x(), sh.Hot([
    EVENT.next(10, () => ++i),
    EVENT.next(20, () => ++i),
    EVENT.next(30, () => ++i),
    EVENT.next(40, () => ++i),
    EVENT.next(50, () => ++i)
  ])))
  t$.subscribe(ob0, sh)
  t$.subscribe(ob1, sh)
  sh.advanceBy(50)
  t.deepEqual(ob0, ob1)
  t.deepEqual(ob0.results, [
    EVENT.next(10, 1),
    EVENT.next(20, 2),
    EVENT.next(30, 3),
    EVENT.next(40, 4),
    EVENT.next(50, 5)
  ])
})
