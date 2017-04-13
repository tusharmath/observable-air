/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

import test from 'ava'
import {map} from '../src/operators/Map'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'

const {next, complete} = EVENT

test('MapObservable.subscribe()', t => {
  const sh = TestScheduler.of()
  const $ = sh.Cold<number>([
    next(210, 0),
    next(220, 10),
    next(230, 20),
    complete(250)
  ])
  const {results} = sh.start(() => map((x: number) => x + 1, $))
  t.deepEqual(results, [
    next(410, 1),
    next(420, 11),
    next(430, 21),
    complete(450)
  ])
})

test('MapObservable.subscribe():HOT', t => {
  const sh = TestScheduler.of()
  const $ = sh.Hot<number>([
    next(100, -10),
    next(210, 0),
    next(220, 10),
    next(230, 20),
    complete(250)
  ])
  const {results} = sh.start(() => map((x: number) => x + 1, $))
  t.deepEqual(results, [
    next(210, 1),
    next(220, 11),
    next(230, 21),
    complete(250)
  ])
})
