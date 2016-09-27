/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {IntervalObservable} from '../.dist/IntervalObservable'
import U from '../lib/test-util'

test.cb('subscribe()', t => {
  const {subscription, results} = U.testOB(() => IntervalObservable.of(10))
  setTimeout(() => {
    subscription.unsubscribe()
    t.deepEqual(results, [
      {type: 'value', value: 0},
      {type: 'value', value: 1},
      {type: 'value', value: 2},
      {type: 'value', value: 3},
      {type: 'value', value: 4},
      {type: 'value', value: 5},
      {type: 'value', value: 6},
      {type: 'value', value: 7}
    ])
    t.end()
  }, 100)
})
