/**
 * Created by tushar on 28/01/17.
 */
import {test} from 'ava'
import {frames} from '../src/main'
import {TestScheduler} from '../src/testing/TestScheduler'
import {toMarble} from '../src/testing/Marble'
import {scan} from '../src/operators/Scan'

test(t => {
  const sh = TestScheduler.of(10)
  const {results} = sh.start(() => scan((n, i) => i + 1, -1, frames()), 200, 250)
  t.is(toMarble(results), '-0123')
})
