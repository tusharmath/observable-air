/**
 * Created by pankaj on 8/29/17.
 */
import {assert} from 'chai'
import {EVENT} from '../testing/Events'
import {TestScheduler} from '../testing/TestScheduler'
import {map} from './Map'

describe('map', () => {
  const {next, complete} = EVENT
  it('should MapObservable.subscribe()', () => {
    const sh = TestScheduler.of()
    const $ = sh.Cold<number>([
      next(210, 0),
      next(220, 10),
      next(230, 20),
      complete(250)
    ])
    const {results} = sh.start(() => map((x: number) => x + 1, $))
    assert.deepEqual(results, [
      next(410, 1),
      next(420, 11),
      next(430, 21),
      complete(450)
    ])
  })
  it('should MapObservable.subscribe():HOT', () => {
    const sh = TestScheduler.of()
    const $ = sh.Hot<number>([
      next(100, -10),
      next(210, 0),
      next(220, 10),
      next(230, 20),
      complete(250)
    ])
    const {results} = sh.start(() => map((x: number) => x + 1, $))
    assert.deepEqual(results, [
      next(210, 1),
      next(220, 11),
      next(230, 21),
      complete(250)
    ])
  })
})