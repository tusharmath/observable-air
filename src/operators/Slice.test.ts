/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {TestScheduler} from '../testing/TestScheduler'
import {slice} from './Slice'

describe('slice', () => {
  const {next, complete} = EVENT
  it('should takeN(0, 3)', () => {
    const sh = TestScheduler.of()
    const ob$ = sh.Cold([
      next(0, 1),
      next(10, 2),
      next(20, 3),
      next(30, 4),
      next(40, 5),
      complete(50)
    ])
    const {results} = sh.start(() => slice(0, 3, ob$))
    assert.deepEqual(results, [
      next(200, 1),
      next(210, 2),
      next(220, 3),
      complete(220)
    ])
  })
  it('should takeN(0, Infinity)', () => {
    const sh = TestScheduler.of()
    const ob$ = sh.Cold([
      next(0, 1),
      next(10, 2),
      next(20, 3),
      next(30, 4),
      next(40, 5),
      complete(50)
    ])
    const {results} = sh.start(() => slice(0, Infinity, ob$))
    assert.deepEqual(results, [
      next(200, 1),
      next(210, 2),
      next(220, 3),
      next(230, 4),
      next(240, 5),
      complete(250)
    ])
  })
  it('should takeN(1, 3)', () => {
    const sh = TestScheduler.of()
    const ob$ = sh.Cold([
      next(0, 1),
      next(10, 2),
      next(20, 3),
      next(30, 4),
      next(40, 5),
      complete(50)
    ])
    const {results} = sh.start(() => slice(1, 3, ob$))
    assert.deepEqual(results, [
      next(210, 2),
      next(220, 3),
      next(230, 4),
      complete(230)
    ])
  })
  it('should takeN(1, 3):unsubscribe', () => {
    const sh = TestScheduler.of()
    const ob$ = sh.Hot([
      next(201, 1),
      next(210, 2),
      next(220, 3),
      next(230, 4),
      next(240, 5),
      complete(250)
    ])
    const {results} = sh.start(() => slice(1, 3, ob$))
    assert.deepEqual(results, [
      next(210, 2),
      next(220, 3),
      next(230, 4),
      complete(230)
    ])
    assert.deepEqual(ob$.subscriptions.map(t => t.time), [200, 230])
  })
})