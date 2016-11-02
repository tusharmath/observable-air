/**
 * Created by tushar.mathur on 23/10/16.
 */

import test from 'ava'
import {TestScheduler} from '../src/testing/TestScheduler'
import {animationFrames} from '../src/sources/AnimationFrames'
import {toMarble} from '../src/testing/Marble'

test(t => {
  const sh = TestScheduler.of({rafTimeout: 10})
  const {results} = sh.start(() => animationFrames(), 200, 300)
  t.is(toMarble(results), '-012345678')
})
