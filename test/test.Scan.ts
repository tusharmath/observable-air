/**
 * Created by tushar.mathur on 09/10/16.
 */

import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {scan} from '../src/operators/Scan'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

const {next, complete} = EVENT

describe('scan()', () => {
  it('should work like R.scan', () => {
    const sh = createTestScheduler()
    const $ = sh.Cold<number>([
      next(210, 0),
      next(220, 1),
      next(230, 2),
      next(240, 3),
      next(250, 4),
      complete(250)
    ])
    const {results} = sh.start(() => scan((a, b) => a + b, 0, $))
    t.deepEqual(results, [
      next(410, 0),
      next(420, 1),
      next(430, 3),
      next(440, 6),
      next(450, 10),
      complete(450)
    ])
  })
})
