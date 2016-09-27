/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {Observable} from '../.dist/Observable'
import {MapObservable} from '../.dist/MapObservable'
import U from '../lib/test-util'

const createArr$ = () => Observable.of(function (ob) {
  [1, 2, 3].forEach(x => ob.next(x))
})

test('MapObservable.subscribe()', t => {
  const arr$ = createArr$()
  const {results} = U.testOB(() => MapObservable.of((x) => x * 10, arr$))
  t.deepEqual(results, [
    {type: 'value', value: 10},
    {type: 'value', value: 20},
    {type: 'value', value: 30}
  ])
})
