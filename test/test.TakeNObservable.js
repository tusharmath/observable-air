/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler} from '../src/schedulers/TestScheduler'
import {takeN} from '../src/operators/TakeN'
import {ReactiveTest} from '../src/testing/ReactiveTest'

const {next, complete} = ReactiveTest
test('takeN(3)', t => {
  const sh = TestScheduler.of()
  const ob$ = sh.createColdObservable([
    next(0, 1),
    next(10, 2),
    next(20, 3),
    next(30, 4),
    next(40, 5),
    complete(50)
  ])
  const {results} = sh.startScheduler(() => takeN(3, ob$))
  t.deepEqual(results, [
    next(200, 1),
    next(210, 2),
    next(220, 3),
    complete(220)
  ])
})

test('takeN(Infinity)', t => {
  const sh = TestScheduler.of()
  const ob$ = sh.createColdObservable([
    next(0, 1),
    next(10, 2),
    next(20, 3),
    next(30, 4),
    next(40, 5),
    complete(50),
    next(60, 6)
  ])
  const {results} = sh.startScheduler(() => takeN(Infinity, ob$))
  t.deepEqual(results, [
    next(200, 1),
    next(210, 2),
    next(220, 3),
    next(230, 4),
    next(240, 5),
    complete(250)
  ])
})
