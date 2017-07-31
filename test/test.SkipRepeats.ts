/**
 * Created by niranjan on 12/10/16.
 */

import test from 'ava'
import {skipRepeats} from '../src/operators/SkipRepeats'
import {EVENT} from '../src/testing/Events'
import {TestScheduler} from '../src/testing/TestScheduler'

const {next, complete} = EVENT

test('SkipRepeatsObservable.subscribe()', t => {
  const sh = TestScheduler.of()
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
