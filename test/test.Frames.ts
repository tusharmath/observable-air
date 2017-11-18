/**
 * Created by tushar on 28/01/17.
 */
import * as t from 'assert'
import {scan} from '../src/operators/Scan'
import {frames} from '../src/sources/Frames'
import {toMarble} from '../src/testing/Marble'
import {createTestScheduler} from '../src/testing/TestScheduler'

describe('frames()', () => {
  it('should emit requestAnimationFrame events', () => {
    const sh = createTestScheduler(10)
    const {results} = sh.start(() => scan(i => i + 1, -1, frames()), 200, 250)
    t.strictEqual(toMarble(results), '-0123')
  })
})
