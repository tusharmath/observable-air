/**
 * Created by tushar.mathur on 05/11/16.
 */

import test from 'ava'
import {subject} from '../src/sources/Subject'
import {TestScheduler} from '../src/testing/TestScheduler'
import {TestObserver} from '../src/testing/TestObserver'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'

test('observer+observable', t => {
  const sh = TestScheduler.of()
  const ob = new TestObserver<number>(sh)
  const sub = subject<number>()
  sub.subscribe(ob, sh)
  sub.next(100)
  sub.next(200)
  sub.error(Error('hi'))
  sub.complete()
  t.deepEqual(ob.results, [
    ReactiveEvents.next(0, 100),
    ReactiveEvents.next(0, 200),
    ReactiveEvents.error(0, Error('hi')),
    ReactiveEvents.complete(0)
  ])
})

test('multiple-observers', t => {
  const sh = TestScheduler.of()
  const ob0 = new TestObserver<number>(sh)
  const ob1 = new TestObserver<number>(sh)
  const src = subject<number>()

  const sub0 = src.subscribe(ob0, sh)
  src.next(100)
  src.subscribe(ob1, sh)
  src.next(200)
  sub0.unsubscribe()
  src.complete()
  t.deepEqual(ob0.results, [
    ReactiveEvents.next(0, 100),
    ReactiveEvents.next(0, 200)
  ])
  t.deepEqual(ob1.results, [
    ReactiveEvents.next(0, 200),
    ReactiveEvents.complete(0)
  ])
})
