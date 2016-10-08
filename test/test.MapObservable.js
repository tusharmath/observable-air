/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {map} from '../src/operators/Map'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveTest} from '../src/testing/ReactiveTest'

const {next, complete} = ReactiveTest

test('MapObservable.subscribe()', t => {
  const sh = TestScheduler.of()
  const $ = sh.createColdObservable([
    next(210, 0),
    next(220, 10),
    next(230, 20),
    complete(250)
  ])
  const {results} = sh.startScheduler(() => map(x => x + 1, $))
  t.deepEqual(results, [
    next(410, 1),
    next(420, 11),
    next(430, 21),
    complete(450)
  ])
})
