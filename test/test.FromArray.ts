/**
 * Created by tushar.mathur on 04/10/16.
 */

'use strict'

import test from 'ava'
import {fromArray} from '../src/sources/FromArray'
import {map} from '../src/operators/Map'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'

const {next, error} = ReactiveEvents
test(t => {
  const sh = TestScheduler.of()
  const testFunction = (x: any) => x === 2 ? x.do() : x * 100
  const {results} = sh.start(() => map(testFunction, fromArray([1, 2, 3])))
  t.deepEqual(results, [
    next(201, 100),
    error(201, new TypeError())
  ])
})
