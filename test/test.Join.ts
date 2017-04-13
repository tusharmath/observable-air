/**
 * Created by tushar.mathur on 10/10/16.
 */

import test from 'ava'
import {join} from '../src/operators/Join'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'
const {next, complete} = EVENT

test('subscribe()', t => {
  const sh = TestScheduler.of()
  const sa$$ = sh.Cold([
    next(10, 'A0'),
    next(20, 'A1'),
    next(30, 'A2'),
    complete(40)
  ])
  const sb$$ = sh.Cold([
    next(10, 'B0'),
    next(20, 'B1'),
    next(30, 'B2'),
    complete(40)
  ])
  const s$$ = sh.Cold([
    next(10, sa$$),
    next(20, sb$$),
    complete(100)
  ])
  const {results} = sh.start<number>(() => join(s$$))

  t.deepEqual(results, [
    next(220, 'A0'),
    next(230, 'A1'),
    next(230, 'B0'),
    next(240, 'A2'),
    next(240, 'B1'),
    next(250, 'B2'),
    complete(300)
  ])
})


test('subscribe():hot', t => {
  const sh = TestScheduler.of()

  // start(210)
  const sa$$ = sh.Hot([
    next(211, 'A0'),
    next(220, 'A1'),
    next(230, 'A2'),
    complete(240)
  ])

  // start(220)
  const sb$$ = sh.Hot([
    next(205, 'B0'),
    next(215, 'B1'),
    next(225, 'B2'),
    complete(340)
  ])

  // start(210)
  const s$$ = sh.Hot([
    next(210, sa$$),
    next(220, sb$$),
    complete(300)
  ])
  const {results} = sh.start<number>(() => join(s$$))
  t.deepEqual(results, [
    next(211, 'A0'),
    next(220, 'A1'),
    next(225, 'B2'),
    next(230, 'A2'),
    complete(340)
  ])
})
