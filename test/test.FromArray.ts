/**
 * Created by tushar.mathur on 04/10/16.
 */

'use strict'

import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {ReactiveEvents} from '../src/testing/ReactiveEvents'
import {ERROR_MESSAGE, throwError} from '../src/testing/Thrower'
import {fromArray} from '../src/main'

const {next, error} = ReactiveEvents
test(t => {
  const sh = TestScheduler.of()
  const testFunction = (x: any) => x === 2 ? throwError(ERROR_MESSAGE) : x * 100
  const {results} = sh.start(() => fromArray([1, 2, 3]).map(testFunction))
  t.deepEqual(results, [
    next(201, 100),
    error(201, new Error(ERROR_MESSAGE))
  ])
})
