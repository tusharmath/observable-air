/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {interval} from '../src/sources/Interval'
import U from '../lib/test-util'
import {MapObservable} from '../src/operators/Map'

test.cb('subscribe()', t => {
  const {subscription, results} = U.testOB(() => interval(100))
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
      {type: 'value', value: 7},
      {type: 'value', value: 8},
      {type: 'value', value: 9}
    ])
    t.end()
  }, 1000)
})

test.cb('interval+map', t => {
  const ob = new MapObservable(
    x => x * 10,
    interval(100)
  )
  const {subscription, results} = U.testOB(() => ob)
  setTimeout(() => {
    subscription.unsubscribe()
    t.deepEqual(results, [
      {type: 'value', value: 0},
      {type: 'value', value: 10},
      {type: 'value', value: 20},
      {type: 'value', value: 30},
      {type: 'value', value: 40},
      {type: 'value', value: 50},
      {type: 'value', value: 60},
      {type: 'value', value: 70},
      {type: 'value', value: 80},
      {type: 'value', value: 90}
    ])
    t.end()
  }, 1000)
})
