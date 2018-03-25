/**
 * Created by tushar.mathur on 27/09/16.
 */

import * as t from 'assert'
import {EVENT} from '../../src/core/internal/Events'
import {slice} from '../../src/core/operators/Slice'
import {createTestScheduler} from '../../src/core/schedulers/TestScheduler'

const {next, complete} = EVENT
describe('slice()', () => {
  it('should take 0 to 3', () => {
    const sh = createTestScheduler()
    const ob$ = sh.Cold([
      next(0, 1),
      next(10, 2),
      next(20, 3),
      next(30, 4),
      next(40, 5),
      complete(50)
    ])
    const {results} = sh.start(() => slice(0, 3, ob$))
    t.deepEqual(results, [
      next(200, 1),
      next(210, 2),
      next(220, 3),
      complete(220)
    ])
  })

  it('should take 0 to Infinity', () => {
    const sh = createTestScheduler()
    const ob$ = sh.Cold([
      next(0, 1),
      next(10, 2),
      next(20, 3),
      next(30, 4),
      next(40, 5),
      complete(50)
    ])
    const {results} = sh.start(() => slice(0, Infinity, ob$))
    t.deepEqual(results, [
      next(200, 1),
      next(210, 2),
      next(220, 3),
      next(230, 4),
      next(240, 5),
      complete(250)
    ])
  })

  it('should take 1 to 3', () => {
    const sh = createTestScheduler()
    const ob$ = sh.Cold([
      next(0, 1),
      next(10, 2),
      next(20, 3),
      next(30, 4),
      next(40, 5),
      complete(50)
    ])
    const {results} = sh.start(() => slice(1, 3, ob$))
    t.deepEqual(results, [
      next(210, 2),
      next(220, 3),
      next(230, 4),
      complete(230)
    ])
  })

  it('should take 1 to 3 ', () => {
    const sh = createTestScheduler()
    const ob$ = sh.Hot([
      next(201, 1),
      next(210, 2),
      next(220, 3),
      next(230, 4),
      next(240, 5),
      complete(250)
    ])
    const {results} = sh.start(() => slice(1, 3, ob$))
    t.deepEqual(results, [
      next(210, 2),
      next(220, 3),
      next(230, 4),
      complete(230)
    ])
    t.deepEqual(ob$.subscriptions.map(t => t.time), [200, 230])
  })
})
