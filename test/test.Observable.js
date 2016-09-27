/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {Observable} from '../.dist/Observable'

const logger = () => ({
  next: x => console.log(x),
  error: x => console.log('ERROR', x),
  complete: x => console.log('COMPLETE', x)
})

const testOb = (func) => {
  const results = []
  const subscription = func().subscribe({
    next: value => results.push({type: 'value', value}),
    error: value => results.push({type: 'error', value}),
    complete: value => results.push({type: 'complete', value})
  })
  return {subscription, results}
}

test(t => {
  t.true(Observable.of(null) instanceof Observable)
})
test('subscribe()', t => {
  const ob = Observable.of(function (observer) {
    [1, 2, 3].forEach(x => observer.next(x))
    observer.complete(1000)
  })
  t.deepEqual(testOb(() => ob).results, [
    {type: 'value', value: 1},
    {type: 'value', value: 2},
    {type: 'value', value: 3},
    {type: 'complete', value: 1000}
  ])
})
test('subscribe():multiple', t => {
  const ob = Observable.of(function (observer) {
    [1, 2, 3].forEach(x => observer.next(x))
    observer.complete(1000)
  })
  t.deepEqual(testOb(() => ob).results, testOb(() => ob).results)
})
