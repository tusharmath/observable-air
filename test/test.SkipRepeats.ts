/**
 * Created by niranjan on 12/10/16.
 */

import * as t from 'assert'
import {EVENT} from '../src/internal/Events'
import {skipRepeats} from '../src/operators/SkipRepeats'
import {createTestScheduler} from '../src/schedulers/TestScheduler'

const {next, complete} = EVENT

describe('skipRepeats()', () => {
  it('should skip duplicates', () => {
    const sh = createTestScheduler()
    const $ = sh.Cold<number>([
      next(210, 0),
      next(215, 0),
      next(220, 10),
      next(230, 20),
      next(235, 20),
      complete(250)
    ])
    const {results} = sh.start(() => skipRepeats((a, b) => a === b, $))
    t.deepEqual(results, [
      next(410, 0),
      next(420, 10),
      next(430, 20),
      complete(450)
    ])
  })
})
