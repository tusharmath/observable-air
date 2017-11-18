/**
 * Created by tushar.mathur on 27/09/16.
 */

import * as t from 'assert'
import {map} from '../src/operators/Map'
import {EVENT} from '../src/testing/Events'
import {createTestScheduler} from '../src/testing/TestScheduler'

const {next, complete} = EVENT

describe('map()', () => {
  it('should should be subscribe-able', () => {
    const sh = createTestScheduler()
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
  it('should be able to subscribe to hot stream', () => {
    const sh = createTestScheduler()
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
})
