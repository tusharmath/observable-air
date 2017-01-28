/**
 * Created by tushar on 28/01/17.
 */
import {test} from 'ava'
import {frames} from '../src/main'
import {TestScheduler} from '../src/testing/TestScheduler'
import {toMarble} from '../src/testing/Marble'

test(t => {
  const sh = TestScheduler.of(10)
  const {results} = sh.start(() => frames(), 10, 50)
  t.is(toMarble(results, 10), '-012')
})
