/**
 * Created by tushar on 28/01/17.
 */
import * as t from 'assert'
import {scan} from '../src/operators/Scan'
import {frames} from '../src/sources/Frames'
import {toMarble} from '../src/testing/Marble'
import {TestScheduler} from '../src/testing/TestScheduler'

test('frames()', () => {
  const sh = TestScheduler.of(10)
  const {results} = sh.start(() => scan(i => i + 1, -1, frames()), 200, 250)
  t.strictEqual(toMarble(results), '-0123')
})
