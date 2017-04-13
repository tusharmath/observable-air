/**
 * Created by tushar.mathur on 04/10/16.
 */

'use strict'

import test from 'ava'
import {map} from '../src/operators/Map'
import {fromArray} from '../src/sources/FromArray'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ERROR_MESSAGE, throwError} from '../src/testing/Thrower'

const {next, error} = EVENT
test(t => {
  const sh = TestScheduler.of()
  const testFunction = (x: any) => x === 2 ? throwError(ERROR_MESSAGE) : x * 100
  const {results} = sh.start(() => map(testFunction, fromArray([1, 2, 3])))
  t.deepEqual(results, [
    next(201, 100),
    error(201, new Error(ERROR_MESSAGE))
  ])
})
