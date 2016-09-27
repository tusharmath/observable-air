/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {Observable} from '../src/Observable'
import U from '../lib/test-util'

test(t => {
  t.true(Observable.of(null) instanceof Observable)
})
test('subscribe()', t => {
  const ob = Observable.of(function (observer) {
    [1, 2, 3].forEach(x => observer.next(x))
    observer.complete()
  })
  t.deepEqual(U.testOB(() => ob).results, [
    {type: 'value', value: 1},
    {type: 'value', value: 2},
    {type: 'value', value: 3},
    {type: 'complete'}
  ])
})
test('subscribe():multiple', t => {
  const ob = Observable.of(function (observer) {
    [1, 2, 3].forEach(x => observer.next(x))
    observer.complete(1000)
  })
  t.deepEqual(U.testOB(() => ob).results, U.testOB(() => ob).results)
})
