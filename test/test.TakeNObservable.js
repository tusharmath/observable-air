/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {IntervalObservable} from '../src/IntervalObservable'
import U from '../lib/test-util'
import {TakeNObservable} from '../src/op/TakeN'

test.cb('interval+map', t => {
  const ob = new TakeNObservable(10, new IntervalObservable(10))
  const {results} = U.testOB(() => ob)
  setTimeout(() => {
    t.deepEqual(results, [
      {type: 'value', value: 0},
      {type: 'value', value: 1},
      {type: 'value', value: 2},
      {type: 'value', value: 3},
      {type: 'value', value: 4},
      {type: 'value', value: 5},
      {type: 'value', value: 6},
      {type: 'value', value: 7},
      {type: 'value', value: 8},
      {type: 'value', value: 9},
      {type: 'complete'}
    ])
    t.end()
  }, 1000)
})
